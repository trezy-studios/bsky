#!/usr/bin/env node --no-warnings

// Module imports
import 'dotenv/config'
import { program } from 'commander'





// Local imports
import { descriptions } from './command-descriptions.js'
import { handleUserGet } from './helpers/handleUserGet.js'
import packageData from '../package.json' assert { type: 'json' }
import { validateDID } from './helpers/validateDID.js'





program
	.name('bsky-user')
	.description(descriptions.bsky.subcommands.user.description)
	.version(packageData.version)

program
	.command('get')
	.description(descriptions.bsky.subcommands.user.subcommands.get.description)
	.option('--did <value>', 'The dID of the user to be retrieved', validateDID)
	.action(handleUserGet)

program.parse(process.argv)
