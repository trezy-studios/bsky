// Module imports
import ASCII from 'ascii-art'
import { fileURLToPath } from 'node:url'
import path from 'node:path'





const __dirname = path.dirname(fileURLToPath(import.meta.url))
ASCII.Font.fontPath = `${path.resolve(__dirname, '..', 'fonts')}/`





/**
 * Renders a CLI banner.
 *
 * @param {string} title The title of the banner.
 */
export async function renderBanner(title) {
	const renderedArt = await ASCII.font(title, 'ANSI Shadow').completed()

	console.log('')
	console.log('')
	console.log(renderedArt)
}
