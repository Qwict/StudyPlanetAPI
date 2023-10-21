const Joi = require('joi');
const Router = require('@koa/router');

const {
  hasPermission,
  permissions,
  addUserInfo,
} = require('../core/auth');
const userService = require('../service/user');

const validate = require('./_validation');
const {
  getLogger,
} = require('../core/logging');

const getUserById = async (ctx) => {
  const user = await userService.getUserById(ctx.params.id);
  ctx.body = user;
}
getUserById.validationScheme = {
  params: {
    id: Joi.number().required(),
  },
};

const login = async (ctx) => {
  const response = await userService.login(ctx.request.body);
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
  ctx.status = 201;
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
    prefix: '/users',
  });

  router.post('/register', validate(register.validationScheme), register);
  router.post('/login', validate(login.validationScheme), login);
  router.get('/:id', validate(getUserById.validationScheme), getUserById);

  app
    .use(router.routes())
    .use(router.allowedMethods());
};