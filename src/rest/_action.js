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
  logger.info("START DISCOVER", ctx.state.user.email)
  let userId = ctx.state.user.id
  let selectedTime = ctx.request.body.selectedTime
  await actionService.startDiscovering(userId, selectedTime);
  ctx.status = 204;
}

const stopDiscovering = async (ctx) => {
  const logger = getLogger();
  logger.info("STOP DISCOVER:", ctx.state.user.email)
  let userId = ctx.state.user.id
  let discoveredPlanet = await actionService.stopDiscovering(userId);
  ctx.body = discoveredPlanet;
}

const startExploring = async (ctx) => {
  const logger = getLogger();
  logger.info("START EXPLORE:", ctx.state.user.email)
  let userId = ctx.state.user.id
  let selectedTime = ctx.request.body.selectedTime
  let planetId = ctx.request.body.planetId
  await actionService.startExploring(userId, planetId, selectedTime);
  ctx.status = 204;
}


const stopExploring = async (ctx) => {
  const logger = getLogger();
  logger.info("STOP MINE FORM:", ctx.state.user.email)
  let userId = ctx.state.user.id
  let response = await actionService.stopExploring(userId);
  ctx.body = response;
  ctx.status = 201;
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