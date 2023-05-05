// Module imports
import 'dotenv/config'





// Local imports
import { API } from './structures/API.js'
import { BskyBot } from './structures/BskyBot.js'
import { DiscordBot } from './structures/DiscordBot.js'





// Start the Discord bot
DiscordBot.start()

// Start the bsky bot
BskyBot.start()

// Start the web server
API.start()
