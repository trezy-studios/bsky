// Module imports
import {
	addExtension,
	decode,
	decodeMultiple,
} from 'cbor-x'
import bsky from '@atproto/api'
import { CarReader } from '@ipld/car'
import { CID } from 'multiformats'
import { EmbedBuilder } from 'discord.js'
import { Skeet } from '@trezystudios/bsky-lib'
import { WebSocket } from 'ws'





// Local imports
import { DiscordBot } from './DiscordBot.js'
import { logger } from '../helpers/logger.js'
import { parseATURL } from '@trezystudios/bsky-lib/src/helpers/parseATURL.js'





// Constants
const MSG_OP = 1
const SKEET_TYPE = 'app.bsky.feed.post'





/**
 * An instance of a bsky bot.
 */
class BskyBotClass {
	/****************************************************************************\
	 * Private instance properties
	\****************************************************************************/

	#agent = new bsky.BskyAgent({
		service: `https://${process.env.BSKY_SERVICE_URL}`,
	})

	#firehose = null





	/****************************************************************************\
	 * Constructor
	\****************************************************************************/

	/**
	 * Creates a new bsky bot.
	 */
	constructor() {
		addExtension({
			Class: CID,
			tag: 42,
			// eslint-disable-next-line jsdoc/require-jsdoc
			encode: () => {
				throw new Error('cannot encode cids')
			},
			// eslint-disable-next-line jsdoc/require-jsdoc
			decode: bytes => {
				if (bytes[0] !== 0) {
					throw new Error('invalid cid for cbor tag 42')
				}
				return CID.decode(bytes.subarray(1)) // ignore leading 0x00
			},
		})

		this.#bindEvents()
	}





	/****************************************************************************\
	 * Private instance methods
	\****************************************************************************/

	/**
	 * Attaches functions to bsky events.
	 */
	#bindEvents() {}

	/**
	 * Connects to the firehose and handles events.
	 */
	#connectFirehose() {
		this.#firehose = new WebSocket(`wss://${process.env.BSKY_SERVICE_URL}/xrpc/com.atproto.sync.subscribeRepos`)
		this.#firehose.on('message', (...args) => this.#handleFirehoseMessage(...args))
		this.#firehose.on('error', (...args) => this.#handleFirehoseError(...args))
		this.#firehose.on('open', (...args) => this.#handleFirehoseOpen(...args))
	}

	/**
	 * Parses the list of accounts you follow to find those that have naver posted.
	 */
	async #getSilentFollows() {
		const allFollows = []
		const silentFollows = []

		let cursor = null
		let shouldContinue = true

		while (shouldContinue) {
			const params = {
				actor: process.env.BSKY_USER_IDENTIFIER,
				limit: 100,
			}

			if (cursor) {
				params.cursor = cursor
			}

			const response = await this.#agent.getFollows(params)

			if (response.data.follows.length) {
				response.data.follows.forEach(follow => {
					allFollows.push(follow)
				})

				cursor = response.data.cursor
			} else {
				shouldContinue = false
			}
		}

		let index = 0

		while (index < allFollows.length) {
			const follow = allFollows[index]

			const skeets = await this.#agent.getAuthorFeed({
				actor: follow.handle,
				limit: 1,
			})

			if (!skeets.data.feed.length) {
				silentFollows.push(follow)
			}

			index += 1
		}

		return silentFollows.map(follow => follow.handle)
	}

	/**
	 * Handles errors in the firehose.
	 *
	 * @param {*} error
	 */
	#handleFirehoseError(error) {
		logger.error(error)
	}

	/**
	 * Handles messages from the firehose.
	 *
	 * @param {*} data
	 */
	async #handleFirehoseMessage(data) {
		const [
			header,
			body,
		] = decodeMultiple(new Uint8Array(data))

		if (header.op !== MSG_OP) {
			return
		}

		let car = null

		if (!body.blocks) {
			return
		}

		try {
			car = await CarReader.fromBytes(body.blocks)
		} catch (error) {
			console.log(error, body)
		}

		for (const op of body.ops) {
			if (!op.cid) {
				continue
			}

			const block = await car.get(op.cid)
			const record = decode(block.bytes)

			/** Filter out messages other than new skeets. */
			if (record.$type !== SKEET_TYPE) {
				return
			}

			/** Filter out image skeets. */
			if (typeof record.text !== 'string') {
				return
			}

			/** Filter out empty skeets. */
			if (record.text.length === 0) {
				return
			}

			/** Filter out non game dev skeets. */
			// if (!/#trezytest/giu.test(record.text)) {
			// 	return
			// }
			// if (!/game\s?dev/giu.test(record.text)) {
			// 	return
			// }

			const skeet = new Skeet({
				agent: this.#agent,
				cid: op.cid,
				did: body.repo,
				record,
				rkey: op.path.split('/').at(-1),
			})
			await skeet.hydrate()

			const embed = new EmbedBuilder
			embed.setAuthor({
				name: `${skeet.author.displayName} (@${skeet.author.handle})`,
				iconURL: skeet.author.avatar,
				url: skeet.url,
			})
			embed.setColor('#00ff00')
			embed.setDescription(skeet.markdown)
			embed.setTimestamp(skeet.createdAt)

			if (record.reply) {
				const {
					did: parentDID,
					rkey: parentRKEY,
				} = parseATURL(record.reply.parent.uri)

				const parentSkeet = new Skeet({
					agent: this.#agent,
					cid: record.reply.parent.cid,
					did: parentDID,
					rkey: parentRKEY,
				})
				await skeet.hydrate()

				embed.addFields([
					{
						name: 'Reply to',
						value: `${parentSkeet.markdown}\n\n_- ${parentSkeet.byLineMarkdown}_`
							.split('\n')
							.map(line => `> ${line}`)
							.join('\n'),
					},
				])
			}

			if (record.embed?.$type === 'app.bsky.embed.record') {
				const {
					did: embedDID,
					rkey: embedRKEY,
				} = parseATURL(record.embed.record.uri)

				const embedSkeet = new Skeet({
					agent: this.#agent,
					cid: record.embed.record.cid,
					did: embedDID,
					rkey: embedRKEY,
				})
				await skeet.hydrate()

				embed.addFields([
					{
						name: 'Reply to',
						value: `${embedSkeet.markdown}\n\n_- ${embedSkeet.byLineMarkdown}_`
							.split('\n')
							.map(line => `> ${line}`)
							.join('\n'),
					},
				])
			}

			DiscordBot.send({ embeds: [embed] }, process.env.DISCORD_BSKY_FEED_CHANNEL_ID)
		}
	}

	/**
	 * Handles the firehose opening.
	 */
	#handleFirehoseOpen() {
		logger.info('bsky firehose connected.')
	}





	/****************************************************************************\
	 * Public instance methods
	\****************************************************************************/

	/**
	 * Creates a new skeet that will use this API instance for its data.
	 *
	 * @returns {Skeet} The new skeet.
	 */
	createSkeet() {
		return new Skeet({
			agent: this.#agent,
		})
	}

	/**
	 * Tells the client to connect to the bsky API.
	 */
	async start() {
		await this.#agent.login({
			identifier: process.env.BSKY_USER_IDENTIFIER,
			password: process.env.BSKY_USER_PASSWORD,
		})

		this.#connectFirehose()
	}
}

export const BskyBot = new BskyBotClass
