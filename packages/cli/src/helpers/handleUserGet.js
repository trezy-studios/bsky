/**
 * @typedef UserGetOptions
 * @property {string} did The dID of the user.
 */

/**
 * Handler for `bsky user get`.
 *
 * @param {UserGetOptions} options A hash of options that were passed to the command.
 */
export function handleUserGet(options) {
	console.log('options:', options)
}
