#!/usr/bin/env node --no-warnings

// Module imports
import 'dotenv/config'
import { program } from 'commander'





// Local imports
import { descriptions } from './command-descriptions.js'
import { handleLogin } from './helpers/handleLogin.js'
import packageData from '../package.json' assert { type: 'json' }





program
	.name('bsky-login')
	.description(descriptions.bsky.subcommands.login.description)
	.version(packageData.version)
	.option('-f --force', 'Skips verification if a session exists.')
	.action(handleLogin)

program.parse(process.argv)
