const Joi = require('joi');
const Router = require('@koa/router');

const {
  hasPermission,
  permissions,
  addUserInfo,
} = require('../core/auth');
const userService = require('../service/user');

const validate = require('./_validation');

const getAllUsers = async (ctx) => {
  const users = await userService.getAll();
  ctx.body = users;
};
getAllUsers.validationScheme = null;

const getUserByAuth0Id = async (ctx) => {
  let userId = 0;
  try {
    const user = await userService.getByAuth0Id(ctx.state.user.sub);
    userId = user.id;
  } catch (err) {
    await addUserInfo(ctx);
    userId = await userService.register({
      auth0id: ctx.state.user.sub,
      name: ctx.state.user.name,
      email: ctx.state.user.email,
    });
  }
  ctx.body = await userService.getById(userId);
};
// getUserByAuth0Id.validationScheme = {
//   params: {
//     id: Joi.number().integer().positive(),
//   },
// };

const updateUserById = async (ctx) => {
  const user = await userService.updateById(ctx.params.id, ctx.request.body);
  ctx.body = user;
};
updateUserById.validationScheme = {
  params: {
    id: Joi.number().integer().positive(),
  },
  body: {
    name: Joi.string().max(255),
  },
};

const deleteUserById = async (ctx) => {
  await userService.deleteById(ctx.params.id);
  ctx.status = 204;
};
deleteUserById.validationScheme = {
  params: {
    id: Joi.number().integer().positive(),
  },
};

/**
 * Install user routes in the given router.
 *
 * @param {Router} app - The parent router.
 */
module.exports = function installUsersRoutes(app) {
  const router = new Router({
    prefix: '/user',
  });

  router.get('/', getUserByAuth0Id);
  router.put('/:id', validate(updateUserById.validationScheme), updateUserById);
  router.delete('/:id', validate(deleteUserById.validationScheme), deleteUserById);

  app
    .use(router.routes())
    .use(router.allowedMethods());
};