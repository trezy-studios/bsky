/**
 * @typedef SkeetGetOptions
 * @property {string} cid The cID of the skeet.
 * @property {string} did The dID of the skeet author.
 * @property {string} rkey The rKey of the skeet.
 */

/**
 * Handler for `bsky skeet get`.
 *
 * @param {SkeetGetOptions} options A hash of options that were passed to the command.
 */
export function handleSkeetGet(options) {
	console.log('options:', options)
}
