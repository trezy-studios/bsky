#!/usr/bin/env node --no-warnings

// Module imports
import 'dotenv/config'
import { program } from 'commander'





// Local imports
import { descriptions } from './command-descriptions.js'
import packageData from '../package.json' assert { type: 'json' }
import { renderBanner } from './helpers/renderBanner.js'





program
	.name('bsky-about')
	.description(descriptions.bsky.subcommands.about.description)
	.version(packageData.version)
	.action(() => renderBanner('bsky-cli'))

program.parse(process.argv)
