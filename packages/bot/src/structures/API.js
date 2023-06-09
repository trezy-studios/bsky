// Module imports
import body from 'koa-body'
import compress from 'koa-compress'
import cors from '@koa/cors'
import Koa from 'koa'
import KoaRouter from 'koa-router'
import noTrailingSlash from 'koa-no-trailing-slash'





// Local imports
import { bodyBuilder } from '../helpers/bodyBuilder.js'
import { route as healthCheckRoute } from '../routes/v1/health.js'
import { logger } from '../helpers/logger.js'
import { statusCodeGenerator } from '../helpers/statusCodeGenerator.js'





/**
 * An instance of the REST API.
 */
class APIClass {
	/****************************************************************************\
	 * Private instance properties
	\****************************************************************************/

	#client = new Koa

	#port = process.env.PORT || 3000

	#router = new KoaRouter





	/****************************************************************************\
	 * Constructor
	\****************************************************************************/

	/**
	 * Creates a new API.
	 */
	constructor() {
		this.#mountMiddleware()
		this.#mountRoutes()
		this.#mountRouter()
	}





	/****************************************************************************\
	 * Private instance methods
	\****************************************************************************/

	/**
	 * Connects middleware to the Koa server.
	 */
	#mountMiddleware() {
		this.#client.use(noTrailingSlash())
		this.#client.use(compress())
		this.#client.use(cors())
		this.#client.use(body())
		this.#client.use(statusCodeGenerator)
		this.#client.use(bodyBuilder)
	}

	/**
	 * Connects routes to the Koa router.
	 */
	#mountRoutes() {
		healthCheckRoute.mount(this.#router)
	}

	/**
	 * Connects the Koa router to the Koa server.
	 */
	#mountRouter() {
		this.#client.use(this.#router.routes())
		this.#client.use(this.#router.allowedMethods())
	}





	/****************************************************************************\
	 * Public instance methods
	\****************************************************************************/

	/**
	 * Starts the Koa server.
	 */
	start() {
		this.#client.listen(this.#port)
		logger.info(`API is ready; listening on port ${this.#port}.`)
	}
}


export const API = new APIClass
