const jwt = require('jsonwebtoken');
const ServiceError = require('./serviceError');


// disabled for linting
const { getLogger } = require('./logging');

const permissions = Object.freeze({
	loggedIn: 'loggedIn',
	admin: 'admin',
});

function authorization(permission) {
	const logger = getLogger();
	return async (ctx, next) => {
		// const logger = getLogger();
		const token = ctx.headers.authorization;
		let user;
		if (!token) {
			throw ServiceError.unauthorized('No valid token');
		} else {
			// Throws error if verification fails
			try {
				user = jwt.verify(token, process.env.JWT_SECRET
					// , {
					// 	issuer: process.env.AUTH_ISSUER,
					// 	audience: process.env.AUTH_AUDIENCE,
					// }
				);
				ctx.state.user = {
					...ctx.state.user,
					...user,
				};
			} catch (error) {
				logger.error(`Token validation failed: ${error}`);
				throw ServiceError.forbidden('Token validation failed');
			}
		}
		if (user && permission === permissions.loggedIn) {
			await next();
		} else if (user && user.permission && user.permission === permissions.admin) {
			await next();
		} else {
			throw ServiceError.unauthorized(`You do not have the necessary permission of ${permission}`);
		}
		// } else if (user && user.permission && user.permission.includes(permission)) {
		//   await next();
		// } else {
		//   throw ServiceError.unauthorized(`You do not have the necessary permission of ${permission}`);
		// }
	};
}

module.exports = {
	authorization,
	permissions,
};