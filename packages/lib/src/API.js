// Module imports
import bsky from '@atproto/api'





// Local imports
import { BSKY_SERVICE_URL } from './helpers/defaults.js'
import { Skeet } from './Skeet.js'





/**
 * An API instance.
 */
export class API {
	/****************************************************************************\
	 * Private instance properties
	\****************************************************************************/

	#agent





	/****************************************************************************\
	 * Constructor
	\****************************************************************************/

	/**
	 * Creates a new instance of the API manager.
	 *
	 * @param {string} serviceURL The URL to use for the bsky agent.
	 */
	constructor(serviceURL = `https://${BSKY_SERVICE_URL}`) {
		try {
			new URL(serviceURL)
		} catch (error) {
			if (error.message === 'Failed to construct \'URL\': Invalid URL') {
				throw new TypeError(`Invalid service URL; received \`${serviceURL}\``)
			}

			throw error
		}

		this.#agent = new bsky.BskyAgent({ service: serviceURL })
	}





	/****************************************************************************\
	 * Public instance methods
	\****************************************************************************/

	/**
	 * Makes a GET request.
	 *
	 * @param {string} url The URL to make the request against.
	 * @param {object} params Parameters to send wih the request.
	 */
	async get(url, params) {
		// TODO: Make this do something.
		await new Promise(resolve => {
			resolve({
				params,
				url,
			})
		})
	}

	/**
	 * Makes a POST request.
	 *
	 * @param {string} url The URL to make the request against.
	 * @param {object} params Parameters to send wih the request.
	 * @param {object} body A body to send with the request.
	 */
	async post(url, params, body) {
		// TODO: Make this do something.
		await new Promise(resolve => {
			resolve({
				body,
				params,
				url,
			})
		})
	}

	/**
	 * Authenticates the agent o make privileged requests.
	 *
	 * @param {string} username The username with which to authenticate. This is the same as the user's handle.
	 * @param {string} password The password with which to authenticate. For now, this should be an app password.
	 * @returns {Promise<import('./types/SessionData.js').SessionData>} Session data.
	 */
	async login(username, password) {
		const response = await this.#agent.login({
			identifier: username,
			password,
		})

		return response.data
	}

	/**
	 * Resumes an existing session using an access JWT, a refresh JWT, and a dID.
	 *
	 * @param {import('./types/SessionData.js').SessionData} sessionData An object containing data for the session to resume.
	 * @returns {Promise<object>} Updated session data.
	 */
	async resumeSession(sessionData) {
		const response = await this.#agent.resumeSession(sessionData)

		return response.data
	}
}
