// Module imports
import {
	Client,
	REST as DiscordRESTAPI,
	Routes as DiscordRoutes,
	GatewayIntentBits,
	Partials,
} from 'discord.js'





// Local imports
import { commands } from '../commands/index.js'
import { logger } from '../helpers/logger.js'
// import { reactionRoles } from '../reactionRoles.js'





const {
	DISCORD_CLIENT_ID,
	DISCORD_GUILD_ID,
	DISCORD_TOKEN,
} = process.env



/**
 * An instance of a Discord bot.
 */
class DiscordBotClass {
	/****************************************************************************\
	 * Private instance properties
	\****************************************************************************/

	#client = new Client({
		intents: [
			GatewayIntentBits.GuildMessages,
			GatewayIntentBits.GuildMessageReactions,
			GatewayIntentBits.Guilds,
		],
		partials: [
			Partials.Channel,
			Partials.Message,
			Partials.Reaction,
		],
	})

	#restClient = new DiscordRESTAPI({ version: '9' })
		.setToken(DISCORD_TOKEN)





	/****************************************************************************\
	 * Constructor
	\****************************************************************************/

	/**
	 * Creates a new Discord bot.
	 */
	constructor() {
		this.#bindEvents()
	}





	/****************************************************************************\
	 * Private instance methods
	\****************************************************************************/

	/**
	 * Attaches functions to Discord events.
	 */
	#bindEvents() {
		this.#client.on('interactionCreate', this.#handleInteractionCreate)
		this.#client.on('messageReactionAdd', this.#handleMessageReactionAdd)
		this.#client.on('messageReactionRemove', this.#handleMessageReactionRemove)

		this.#client.once('ready', this.#handleReady)
	}

	/**
	 * Retrieves all commands currently registered for this bot on the guild.
	 *
	 * @returns {object} An object of command names and IDs.
	 */
	async #getCurrentCommands() {
		const route = DiscordRoutes.applicationGuildCommands(DISCORD_CLIENT_ID, DISCORD_GUILD_ID)

		try {
			const response = await this.#restClient.get(route)
			return response.reduce((accumulator, command) => {
				accumulator[command.name] = command.id
				return accumulator
			}, {})
		} catch (error) {
			logger.error(`Unable to get application commands for guild ${DISCORD_GUILD_ID}`)
			logger.error(error)
			return {}
		}
	}

	/**
	 * Handles the creation of interactions.
	 *
	 * @param {import('discord.js').Interaction} interaction The interaction object.
	 */
	async #handleInteractionCreate(interaction) {
		if (!interaction.isCommand()) {
			return
		}

		const { commandName } = interaction

		if (commands[commandName]) {
			logger.info(`Executing ${commandName} command...`)
			await commands[commandName].execute(interaction)
			logger.info('Done.')
		} else {
			await interaction.reply('Command not recognized.')
		}
	}

	/**
	 * Handles reactions being attached to messages.
	 *
	 * @param {import('discord.js').Reaction} reaction The reaction that was added.
	 */
	async #handleMessageReactionAdd(reaction) {
		if (reaction.partial) {
			try {
				await reaction.fetch()
			} catch (error) {
				logger.error(error)
				// return
			}
		}

		// if (reactionRoles[reaction.message.id]) {
		// 	const reactionRole = reactionRoles[reaction.message.id]

		// 	const guild = client.guilds.resolve(reaction.message.guildId)
		// 	const guildMember = guild.members.fetch(user)
		// 	const role = guild.roles.resolve(reactionRole.roleID)

		// 	await guildMember.roles.add(role)
		// }
	}

	/**
	 * Handles reactions being attached to messages.
	 *
	 * @param {import('discord.js').Reaction} reaction The reaction that was removed.
	 */
	async #handleMessageReactionRemove(reaction) {
		if (reaction.partial) {
			try {
				await reaction.fetch()
			} catch (error) {
				logger.error(error)
				// return
			}
		}

		// if (reactionRoles[reaction.message.id]?.removeOnUnreact) {
		// 	const allReactions = reaction.message.reactions.cache

		// 	const userHasReactionsOnMessage = allReactions.some(otherReaction => {
		// 		return otherReaction
		// 			.users
		// 			.cache
		// 			.some(reactionUser => reactionUser.id === user.id)
		// 	})

		// 	if (!userHasReactionsOnMessage) {
		// 		const reactionRole = reactionRoles[reaction.message.id]

		// 		const guild = client.guilds.resolve(reaction.message.guildId)
		// 		const guildMember = guild.members.resolve(user.id)
		// 		const role = guild.roles.resolve(reactionRole.roleID)

		// 		await guildMember.roles.remove(role)
		// 	}
		// }
	}

	/**
	 * Handles the Discord client being fully connected and ready.
	 */
	#handleReady() {
		logger.info('Discord Client is ready.')
	}

	/**
	 * Registers slash commands with Discord.
	 */
	async #registerCommands() {
		// Generate the API route for updating bot commands.
		const route = DiscordRoutes.applicationGuildCommands(DISCORD_CLIENT_ID, DISCORD_GUILD_ID)

		// Sends a PUT request to the Discord API to create our search command.
		await this.#restClient.put(route, {
			body: Object.values(commands).map(({ command }) => command.toJSON()),
		})
	}

	/**
	 * Unregisters old commands.
	 */
	async #unregisterStaleCommands() {
		const registeredCommands = await this.#getCurrentCommands()

		const newCommandNames = Object.keys(commands)

		const commandsToDelete = Object
			.entries(registeredCommands)
			.reduce((accumulator, [name, id]) => {
				if (!newCommandNames.includes(name)) {
					accumulator.push([id, name])
				}

				return accumulator
			}, [])

		let commandDeleteIndex = 0
		while (commandDeleteIndex < commandsToDelete.length) {
			const [
				id,
				name,
			] = commandsToDelete[commandDeleteIndex]

			try {
				await	this.#restClient.delete(DiscordRoutes.applicationGuildCommand(DISCORD_CLIENT_ID, DISCORD_GUILD_ID, id))
				logger.log(`Deleted command ${name} (${id}) (reason: unused)`)
			} catch (error) {
				logger.error(`Unable to delete ${name} command`)
				logger.error(error)
			}

			commandDeleteIndex += 1
		}
	}





	/****************************************************************************\
	 * Public instance methods
	\****************************************************************************/

	/**
	 * Retrieves a channel.
	 *
	 * @param {string} channelID The ID of the channel to be retrieved
	 */
	async getChannelByID(channelID) {
		const guild = await this.getGuild()

		const channels = await guild.channels.fetch()
		const channel = channels.get(channelID)

		return channel
	}

	/**
	 * Retrieves the guild object.
	 */
	async getGuild() {
		const guilds = await this.#client.guilds.fetch()
		const guildID = Array.from(guilds.keys())[0]
		const partialGuild = guilds.get(guildID)
		return partialGuild.fetch()
	}

	/**
	 * Sends a message to a channel.
	 *
	 * @param {string} message The message to be sent.
	 * @param {string} channelID The channel to send the message to.
	 * @returns {Promise<import('discord.js').Message>} The message object.
	 */
	async send(message, channelID) {
		const discordChannel = await this.getChannelByID(channelID)
		return discordChannel.send(message)
	}

	/**
	 * Tells the client to connect to the Discord Gateway API.
	 */
	async start() {
		await this.#client.login(DISCORD_TOKEN)
		await this.#unregisterStaleCommands()
		await this.#registerCommands()
	}
}

export const DiscordBot = new DiscordBotClass
