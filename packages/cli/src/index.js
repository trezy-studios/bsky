#!/usr/bin/env node --no-warnings

// Module imports
import 'dotenv/config'
import { program } from 'commander'





// Local imports
import { descriptions } from './command-descriptions.js'
import packageData from '../package.json' assert { type: 'json' }





program
	.name('bsky')
	.version(packageData.version)

program.command('about', descriptions.bsky.subcommands.about.description)
program.command('login', descriptions.bsky.subcommands.login.description)
program.command('logout', descriptions.bsky.subcommands.logout.description)
program.command('skeet', descriptions.bsky.subcommands.skeet.description)
program.command('user', descriptions.bsky.subcommands.user.description)

program.parse(process.argv)
