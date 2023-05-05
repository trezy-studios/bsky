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
 * @param {string} body The content of the skeet.
 */
export async function handleSkeetPost(body) {
	const isLoggedIn = await verifySession()

	if (!isLoggedIn) {
		console.log('Please use the `login` command to authenticate before posting content.')
		process.exit()
	}

	const bskyAPI = await login()

	const skeet = bskyAPI.createSkeet(body)

	await skeet.publish()

	console.log(`Success! Skeet is available at ${skeet.url}`)
}
