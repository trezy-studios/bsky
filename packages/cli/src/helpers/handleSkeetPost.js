// Local imports
import { login } from './login.js'
import { verifySession } from './config.js'





/**
 * @typedef SkeetPostOptions
 * @property {string} content The body the skeet.
 */

/**
 * Handler for `bsky skeet post`.
 *
 * @param {string} content The content of the skeet.
 * @param {SkeetPostOptions} options A hash of options that were passed to the command.
 */
export async function handleSkeetPost(content, options) {
	const isLoggedIn = await verifySession()

	if (!isLoggedIn) {
		console.log('Please use the `login` command to authenticate before posting content.')
		process.exit()
	}

	const bskyAPI = await login()

	// bskyAPI.createSkeet({ body: content })

	console.log({
		content,
		options,
	})
}
