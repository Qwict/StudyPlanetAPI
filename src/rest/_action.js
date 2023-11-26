const Joi = require('joi');
const jwt = require('jsonwebtoken');
const Router = require('@koa/router');
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
  logger.info("User in route:", ctx.state.user)
  let userId = ctx.state.user.id
  let selectedTime = ctx.request.body.selectedTime
  await actionService.startDiscovering(userId, selectedTime);
  ctx.status = 204;
}

const stopDiscovering = async (ctx) => {
  const logger = getLogger();
  logger.info("STOP DISCOVER FORM:", ctx.request.headers)
  let userId = ctx.state.user.id
  let discoveredPlanet = await actionService.stopDiscovering(userId);
  logger.info("Discovered planet:" + discoveredPlanet.name)
  ctx.body = discoveredPlanet;
}

const startExploring = async (ctx) => {
  const logger = getLogger();
  logger.info("MINE FORM:", ctx.request.headers)
  ctx.status = 204;
}


const stopExploring = async (ctx) => {
  const logger = getLogger();
  logger.info("STOP MINE FORM:", ctx.request.headers)
}

module.exports = function installActionsRoutes(app) {
  const router = new Router({
    prefix: '/v1/actions',
  });

  router.post('/discover', authorization(permissions.loggedIn), startDiscovering);
  router.post('/explore', authorization(permissions.loggedIn), startExploring);

  router.put('/discover', authorization(permissions.loggedIn), stopDiscovering);
  router.put('/explore', authorization(permissions.loggedIn), stopExploring);

  app
    .use(router.routes())
    .use(router.allowedMethods());;
}