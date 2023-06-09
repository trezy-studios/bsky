// Module imports
import { API } from '@trezystudios/bsky-lib'





// Local imports
import { getSession } from './config.js'





/**
 * Convenience method for resuming a session if one exists.
 *
 * @param {API} [api] An instance of the bsky API.
 * @returns {Promise<API>} The passed instance of the bsky API, or a new one if none was passed.
 */
export async function login(api) {
	if (!api) {
		api = new API
	}

	const session = await getSession()

	if (!session) {
		throw new Error('Not logged in.')
	}

	await api.resumeSession(session)

	return api
}
