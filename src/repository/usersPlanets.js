const {
  tables,
  getKnex
} = require('../data/index');
const {
  getLogger
} = require('../core/logging');

const findAllUserPlanets = async (userId) => {
  return planets = await getKnex()('users_planets as up')
    .select('up.*', 'p.*')
    .join('planets as p', 'up.planet_id', 'p.id')
    .where('up.user_id', userId)
    .orderBy('p.name', 'asc');
};

const findAllUndiscoverdPlanets = async (userId) => {
  // TODO this does not work because there is no relation between users and planets yet
  // return planets = await getKnex()('users_planets as up')
  //   .select('up.*', 'p.*')
  //   .join('planets as p', 'up.planet_id', 'p.id')
  //   .whereNot('up.user_id', userId);

  const discoveredPlanets = await findAllUserPlanets(userId);
  const discoveredPlanetIds = discoveredPlanets.map((planet) => planet.id);
  const undiscoveredPlanets = await getKnex()('planets')
    .select()
    .whereNotIn('id', discoveredPlanetIds);
  return undiscoveredPlanets;
}

/**
 * Create a relation between a user and a planet.
 */
const createUserPlanet = async (
  userId,
  planetId,
) => {
  const logger = getLogger();
  logger.info(`Creating user planet relation for user ${userId} and planet ${planetId}`)
  try {
    const [id] = await getKnex()(tables.usersPlanets)
      .insert({
        user_id: userId,
        planet_id: planetId,
      });
    return id;
  } catch (error) {
    const logger = getLogger();
    logger.error('Error in create', {
      error,
    });
    throw error;
  }
};

module.exports = {
  findAllUserPlanets,
  findAllUndiscoverdPlanets,
  createUserPlanet,
};