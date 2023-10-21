const {
  tables,
  getKnex,
} = require('../data');
const {
  getLogger,
} = require('../core/logging');

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

async function findByMail(email) {
  return getKnex()(tables.users)
    .where('email', email).first();
}


module.exports = {
  findByMail,
  findById,
  addExperience,
};