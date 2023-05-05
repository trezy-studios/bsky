// Module imports
import { API } from '@trezystudios/bsky-lib'
import inquirer from 'inquirer'





// Local imports
import {
	getSession,
	saveSession,
} from './config.js'





/**
 * Handler for `bsky skeet post`.
 *
 * @param {object} options Options passed from the CLI.
 */
export async function handleLogin(options) {
	let session = await getSession()

	if (session && !options.force) {
		const { overwriteSession } = await inquirer.prompt([
			{
				default: false,
				message: 'This will overwrite your existing session data. Would you like to continue anyway?',
				name: 'overwriteSession',
				type: 'confirm',
			},
		])

		if (!overwriteSession) {
			console.log('The current session has been be preserved.')
			process.exit()
		}
	}

	const {
		password,
		username,
	} = await inquirer.prompt([
		{
			message: 'Username (e.g. jay.bsky.team)',
			// eslint-disable-next-line jsdoc/require-jsdoc
			filter(value) {
				return value.replace(/^@/u, '')
			},
			name: 'username',
			type: 'input',
		},
		{
			message: 'Password (please use an app password)',
			name: 'password',
			type: 'password',
		},
	])

	const bskyAPI = new API

	try {
		if (session) {
			session = await bskyAPI.resumeSession(session)
		} else {
			const response = await bskyAPI.login(username, password)
			session = response
		}

		await saveSession(session)
	} catch (error) {
		console.log(error)
	}

	console.log('Logged in!')
}
