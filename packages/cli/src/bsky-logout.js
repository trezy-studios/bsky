#!/usr/bin/env node --no-warnings

// Module imports
import 'dotenv/config'
import { program } from 'commander'





// Local imports
import { descriptions } from './command-descriptions.js'
import { handleLogout } from './helpers/handleLogout.js'
import packageData from '../package.json' assert { type: 'json' }





program
	.name('bsky-logout')
	.description(descriptions.bsky.subcommands.logout.description)
	.version(packageData.version)
	.option('-f --force', 'Skips verification if a session exists.')
	.action(handleLogout)

program.parse(process.argv)
