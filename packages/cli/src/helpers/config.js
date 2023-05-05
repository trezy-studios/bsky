// Module imports
import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'





// Constants
const configDirectoryPath = path.join(os.homedir(), '.config', 'bsky-cli')
const sessionFilePath = path.join(configDirectoryPath, '.session')





/**
 * Validates that required config files and directories exist.
 */
async function validateConfig() {
	// eslint-disable-next-line security/detect-non-literal-fs-filename
	await fs.mkdir(configDirectoryPath, { recursive: true })
}

/**
 * Deletes local session data.
 */
export async function deleteSession() {
	await validateConfig()

	// eslint-disable-next-line security/detect-non-literal-fs-filename
	await fs.unlink(sessionFilePath)
}

/**
 * Retrieves session data from disk.
 *
 * @returns {import('@trezystudios/bsky-lib').SessionData} The session data.
 */
export async function getSession() {
	await validateConfig()

	// eslint-disable-next-line security/detect-non-literal-fs-filename
	let sessionData = null

	try {
		// eslint-disable-next-line security/detect-non-literal-fs-filename
		const sessionDataString = await fs.readFile(sessionFilePath, 'utf8')
		sessionData = JSON.parse(sessionDataString)
	} catch (error) {
		if (!error.message.startsWith('ENOENT')) {
			console.log(error)
		}
	}

	return sessionData
}

/**
 * Saves the session data to disk.
 *
 * @param {import('@trezystudios/bsky-lib').SessionData} sessionData The session data to be saved.
 */
export async function saveSession(sessionData) {
	await validateConfig()

	// eslint-disable-next-line security/detect-non-literal-fs-filename
	await fs.writeFile(sessionFilePath, JSON.stringify(sessionData))
}

/**
 * Verifies that a session file exists.
 *
 * @returns {Promise<boolean>} Whether a session file exists.
 */
export async function verifySession() {
	await validateConfig()

	try {
		// eslint-disable-next-line security/detect-non-literal-fs-filename
		const sessionFileStats = await fs.stat(sessionFilePath)
		return sessionFileStats.isFile()
	} catch (error) {
		if (!error.message.startsWith('ENOENT')) {
			console.log(error)
		}
	}

	return false
}
