// Module imports
import { API } from '@trezystudios/bsky-lib'





// Local imports
import {
	getSession,
	saveSession,
} from './config.js'





/**
 * Convenience method for resuming a session if one exists.
 *
 * @param {API} [api] An instance of the bsky API.
 * @returns {API} The passed instance of the bsky API, or a new one if none was passed.
 */
export async function login(api) {
	if (!api) {
		api = new API
	}

	const oldSession = await getSession()

	if (!oldSession) {
		throw new Error('Not logged in.')
	}

	const newSession = await api.resumeSession(oldSession)

	await saveSession(newSession)

	return api
}
