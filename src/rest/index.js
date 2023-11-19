const Router = require('@koa/router');

// const installPlanetRouter = require('./_planet');
const installUserRouter = require('./_user');
const installHealthRouter = require('./_health');
const installActionsRouter = require('./_action');


const {
    getLogger
} = require('../core/logging');

/**
 * Install all routes in the given Koa application.
 *
 * @param {Koa} app - The Koa application.
 */
module.exports = (app) => {
    const logger = getLogger();
    const router = new Router({
        prefix: '/api',
    });
    logger.info('Installing routes');

    // installPlanetRouter(router);
    installHealthRouter(router);
    installUserRouter(router);
    installActionsRouter(router);

    logger.info('Routes installed');
    app.use(router.routes()).use(router.allowedMethods());
};