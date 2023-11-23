const Joi = require('joi');
const Router = require('@koa/router');

const {
  authorization,
  permissions,
} = require('../core/auth');
const ServiceError = require('../core/serviceError');

const userService = require('../service/user');

const validate = require('./_validation');
const {
  getLogger,
} = require('../core/logging');
const { log } = require('winston');

const getUser = async (ctx) => {
  // simulate slow network here
  // await new Promise(resolve => setTimeout(resolve, 3000));
  const response = await userService.getUserWithToken(ctx.headers.authorization);
  logger = getLogger();
  logger.debug(`User: ${response.user}`);
  if (response.validated) {
    ctx.body = response;
    ctx.status = 200;
  } else {
    ctx.status = 401;
  }

}
getUser.validationScheme = null;

const login = async (ctx) => {
  const response = await userService.login(ctx.request.body);
  await new Promise(resolve => setTimeout(resolve, 1000));
  ctx.body = response;
  if (response.validated) {
    ctx.status = 201;
  } else {
    ctx.status = 401;
  }
};
login.validationScheme = {
  body: {
    email: Joi.string(),
    password: Joi.string(),
  },
};

const register = async (ctx) => {
  const response = await userService.register(ctx.request.body);
  ctx.body = response;
  try {
    if (response.validated) {
      ctx.status = 201;
    } else {
      ctx.status = 401;
    }
  } catch (error) {
    ctx.status = 409;
  }

};
register.validationScheme = {
  body: {
    name: Joi.string(),
    email: Joi.string(),
    password: Joi.string(),
  },
};

/**
 * Install user routes in the given router.
 *
 * @param {Router} app - The parent router.
 */
module.exports = function installUsersRoutes(app) {
  const router = new Router({
    prefix: '/v1/users',
  });

  router.post('/register', validate(register.validationScheme), register);
  router.post('/login', validate(login.validationScheme), login);
  router.get('/', validate(getUser.validationScheme), authorization(permissions.loggedIn), getUser);

  app
    .use(router.routes())
    .use(router.allowedMethods());
};