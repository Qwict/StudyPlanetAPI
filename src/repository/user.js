const {
  tables,
  getKnex,
} = require('../data');
const {
  getLogger,
} = require('../core/logging');
const ServiceError = require('../core/serviceError');
const actionRepository = require('./action');

/**
 * Find a user with the given id.
 *
 * @param {string} id - The id to search for.
 */
const findById = async (id) => {
  let user = await getKnex()(tables.users)
    .where('id', id)
    .first();
  // Prevent circular dependancy
  const discoveredPlanets = await getKnex()('users_planets as up')
    .select('up.*', 'p.*')
    .join('planets as p', 'up.planet_id', 'p.id')
    .where('up.user_id', id)
    .orderBy('p.name', 'asc');
  user = {
    ...user,
    discoveredPlanets: discoveredPlanets,
  }
  return user;
};

const addExperience = async (userId, experience) => {
  const user = await findById(userId);
  const newExperience = user.experience + experience;
  await getKnex()(tables.users)
    .where('id', userId)
    .update({
      experience: newExperience,
    });
}


async function create({
  name,
  email,
  salt,
  hash,
}) {
  // is there a better way to catch a duplicate error?
  const existingUser = await findByMail(email);
  const logger = getLogger();
  if (existingUser !== undefined) {
    logger.error('Error in create', {
      error,
    });
    throw error;
  }
  try {
    const [id] = await getKnex()(tables.users).insert({
      name,
      email,
      salt,
      hash,
    });
    await actionRepository.createActionByUserId(id, {});
    logger.info(`User ${email} created`);
    return findById(id);
  } catch (error) {
    const logger = getLogger();
    logger.error('Error in create', {
      error,
    });
    throw ServiceError.forbidden('Error creating user');
  }
}

// For local use only! Use findById() : will return planets!!!
async function findByMail(email) {
  return await getKnex()(tables.users)
    .where('email', email).first();
}


module.exports = {
  findByMail,
  findById,
  addExperience,
  create,
};