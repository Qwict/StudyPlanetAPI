const Joi = require('joi');
const Router = require('@koa/router');
const emoji = require('node-emoji');

const {
  authorization,
  permissions,
} = require('../core/auth');

const validate = require('./_validation');
const {
  getLogger,
} = require('../core/logging');

const actionService = require('../service/action');

const startDiscovering = async (ctx) => {
  const logger = getLogger();
  logger.info(`${emoji.get('coffee')} Action: ${ctx.state.user.name} started Discovering`)
  let userId = ctx.state.user.id
  let selectedTime = ctx.request.body.selectedTime
  await actionService.startDiscovering(userId, selectedTime);
  ctx.status = 204;
}
startDiscovering.validationScheme = {
  body: {
    selectedTime: Joi
      .number()
      .integer()
      .max(5 * 60 * 60 * 1000) // 5 hours
      .min(
        process.env.NODE_ENV === 'production' ? 15 * 60 * 1000 : 0 // 15 minutes (if in production mode)
      ),
  },
};

const stopDiscovering = async (ctx) => {
  const logger = getLogger();
  logger.info(`${emoji.get('coffee')} Action: ${ctx.state.user.name} stopped Discovering`)
  let userId = ctx.state.user.id
  let discoveredPlanet = await actionService.stopDiscovering(userId);
  ctx.body = discoveredPlanet;
}
// stopDiscovering.validationScheme = {
//   body: {
//     selectedTime: Joi
//       .number()
//       .integer()
//       .max(5 * 60 * 60 * 1000) // 5 hours
//       .min(
//         process.env.NODE_ENV === 'production' ? 15 * 60 * 1000 : 0 // 15 minutes (if in production mode)
//       ),
//   },
// };


const startExploring = async (ctx) => {
  const logger = getLogger();
  logger.info(`${emoji.get('coffee')} Action: ${ctx.state.user.name} started EXPLORING Planet(id: ${ctx.request.body.planetId})`)
  let userId = ctx.state.user.id
  let selectedTime = ctx.request.body.selectedTime
  let planetId = ctx.request.body.planetId
  await actionService.startExploring(userId, planetId, selectedTime);
  ctx.status = 204;
}
startExploring.validationScheme = {
  body: {
    planetId: Joi.number().integer(),
    selectedTime: Joi
      .number()
      .integer()
      .max(5 * 60 * 60 * 1000) // 5 hours
      .min(
        process.env.NODE_ENV === 'production' ? 15 * 60 * 1000 : 0 // 15 minutes (if in production mode)
      ),
  },
};


const stopExploring = async (ctx) => {
  const logger = getLogger();
  logger.info(`${emoji.get('coffee')} Action: ${ctx.state.user.name} stopped EXPLORING`)
  let userId = ctx.state.user.id
  let response = await actionService.stopExploring(userId);
  ctx.body = response;
  ctx.status = 201;
}
// stopDiscovering.validationScheme = {
//   body: {
//     selectedTime: Joi
//       .number()
//       .integer()
//       .max(5 * 60 * 60 * 1000) // 5 hours
//       .min(
//         process.env.NODE_ENV === 'production' ? 15 * 60 * 1000 : 0 // 15 minutes (if in production mode)
//       ),
//   },
// };

module.exports = function installActionsRoutes(app) {
  const router = new Router({
    prefix: '/v1/actions',
  });

  router.post('/discover', validate(startDiscovering.validationScheme), authorization(permissions.loggedIn), startDiscovering);
  router.post('/explore', validate(startExploring.validationScheme), authorization(permissions.loggedIn), startExploring);

  router.put(
    '/discover',
    // validate(stopDiscovering.validationScheme),
    authorization(permissions.loggedIn),
    stopDiscovering
  );
  router.put(
    '/explore',
    // validate(stopExploring.validationScheme),
    authorization(permissions.loggedIn),
    stopExploring
  );

  app
    .use(router.routes())
    .use(router.allowedMethods());;
}