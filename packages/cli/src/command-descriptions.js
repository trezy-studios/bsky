// Local imports
import packageData from '../package.json' assert { type: 'json' }





export const descriptions = {
	bsky: {
		description: packageData.description,
		subcommands: {
			about: {
				description: 'Information about the CLI.',
			},
			login: {
				description: 'Authenticate the CLI to perform privileged actions.',
			},
			logout: {
				description: 'Logs the CLI out of your account.',
			},
			skeet: {
				description: 'Commands for creating and retrieving skeets.',
				subcommands: {
					get: {
						description: 'Retrieve a skeet.',
					},
					post: {
						description: 'Create a new skeet. Must be logged in.',
					},
				},
			},
			user: {
				description: 'Commands for retrieving user data.',
				subcommands: {
					get: {
						description: 'Retrieve a user\'s profile.',
					},
				},
			},
		},
	},
}
