/**
 * Validates a dID string.
 *
 * @param {string} did The dID to be parsed.
 * @returns {string} The unique identifier from the dID.
 */
export function validateDID(did) {
	const result = /^(?:(?:did:)?plc:)?(?<uid>\w+)$/u.exec(did.trim())

	// TODO: Validate the did.

	return result.groups.uid
}
