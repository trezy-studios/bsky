#!/usr/bin/env node --no-warnings

// Module imports
import 'dotenv/config'
import { program } from 'commander'





// Local imports
import { descriptions } from './command-descriptions.js'
import { handleSkeetGet } from './helpers/handleSkeetGet.js'
import { handleSkeetPost } from './helpers/handleSkeetPost.js'
import packageData from '../package.json' assert { type: 'json' }
import { validateCID } from './helpers/validateCID.js'
import { validateDID } from './helpers/validateDID.js'
import { validateRKEY } from './helpers/validateRKEY.js'





program
	.name('bsky-skeet')
	.description(descriptions.bsky.subcommands.skeet.description)
	.version(packageData.version)

program
	.command('get')
	.description(descriptions.bsky.subcommands.skeet.subcommands.get.description)
	.option('--cid', 'The cID of the skeet to be retrieved', validateCID)
	.option('--did <value>', 'The dID of the skeet to be retrieved', validateDID)
	.option('--rkey', 'The rKey of the skeet to be retrieved', validateRKEY)
	.action(handleSkeetGet)

program
	.command('post')
	.description(descriptions.bsky.subcommands.skeet.subcommands.post.description)
	.argument('<content>', 'The content of the skeet')
	.action(handleSkeetPost)

program.parse(process.argv)
