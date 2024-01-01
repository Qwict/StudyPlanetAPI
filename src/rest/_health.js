const Router = require('@koa/router');

const healthService = require('../service/health');

const validate = require('./_validation');
const { getLogger } = require('../core/logging');

const ping = async (ctx) => {
  ctx.body = healthService.ping();
};
ping.validationScheme = null;

const getVersion = async (ctx) => {
  logger = getLogger()
  logger.info(`getVersion called: ${ctx.headers.Authorizaion}`)
  ctx.body = await healthService.getVersion();
};
getVersion.validationScheme = null;

/**
 * Install health routes in the given router.
 *
 * @param {Router} app - The parent router.
 */
module.exports = function installPlacesRoutes(app) {
  const router = new Router({
    prefix: '/v1/health',
  });

  router.get('/ping', validate(ping.validationScheme), ping);
  router.get('/version', validate(getVersion.validationScheme), getVersion);

  app
    .use(router.routes())
    .use(router.allowedMethods());
};