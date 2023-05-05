// Module imports
import inquirer from 'inquirer'





// Local imports
import {
	deleteSession,
	getSession,
} from './config.js'





/**
 * Handler for `bsky skeet post`.
 *
 * @param {object} options Options passed from the CLI.
 */
export async function handleLogout(options) {
	const session = await getSession()

	if (!session) {
		console.log('Not logged in.')
		process.exit()
	} else if (!options.force) {
		const { overwriteSession } = await inquirer.prompt([
			{
				default: false,
				message: 'This will delete your existing session data. Would you like to continue anyway?',
				name: 'overwriteSession',
				type: 'confirm',
			},
		])

		if (!overwriteSession) {
			console.log('The current session has been preserved.')
			process.exit()
		}
	}

	await deleteSession()

	console.log('Logged out!')
}
