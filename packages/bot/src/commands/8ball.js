// Module imports
import { EmbedBuilder } from 'discord.js'
import fetch from 'node-fetch'





// Local imports
import { Command } from '../structures/Command.js'
import { logger } from '../helpers/logger.js'





export default new Command({
	// Meta
	name: '8ball',
	description: 'Ask the Magic 8-ball a question and it may tell you your fortune...',
	options: [
		{
			name: 'query',
			description: 'Your question for the Magic 8-ball',
			type: 'string',
			isRequired: true,
		},
	],

	/**
	 * Retrieves a magic 8ball response from a REST API, then returns the results of that response.
	 *
	 * @param {import('discord.js').Interaction} interaction The interaction object.
	 */
	async execute(interaction) {
		await interaction.deferReply()

		const query = interaction.options.getString('query')
		const magicResponse = await fetch(`https://eightballapi.com/api/biased?lucky=true&question=${query}`)
		const {
			reading,
			sentiment,
		} = await magicResponse.json()

		let emoji = null

		if (sentiment.score > 0) {
			emoji = '😁'
		} else if (sentiment.score < 0) {
			emoji = '😬'
		} else {
			emoji = '🤔'
		}

		logger.info(`Received query: ${query}`)

		const response = new EmbedBuilder
		response.setColor('#cf5ad9')
		response.setTitle('🔮 The Magic 8-ball says...')
		response.setDescription(`${reading} ${emoji}`)
		response.setFooter({ text: query.slice(0, 2048) })

		await interaction.editReply({ embeds: [response] })
	},
})
