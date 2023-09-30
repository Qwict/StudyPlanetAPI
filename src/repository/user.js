const {
  tables,
  getKnex,
} = require('../data');
const {
  getLogger,
} = require('../core/logging');

/**
 * Get all users.
 */
const findAll = () => {
  return getKnex()(tables.users)
    .select()
    .orderBy('name', 'ASC');
};

/**
 * Calculate the total number of user.
 */
const findCount = async () => {
  const [count] = await getKnex()(tables.users)
    .count();
  return count['count(*)'];
};

/**
 * Find a user with the given id.
 *
 * @param {string} id - The id to search for.
 */
const findById = (id) => {
  return getKnex()(tables.users)
    .where('id', id)
    .first();
};

/**
 * Find a user with the given auth0 id.
 *
 * @param {string} auth0id - The id to search for.
 */
const findByAuth0Id = (auth0id) => {
  return getKnex()(tables.users)
    .where('auth0id', auth0id)
    .first();
};

/**
 * Find a user with the given email address.
 *
 * @param {string} email - The email to search for.
 */
const findByEmail = (email) => {
  return getKnex()(tables.users)
    .where('email', email)
    .first();
};

/**
 * Create a new user with the given `name`.
 *
 * @param {object} user - User to create.
 * @param {string} user.name - Name of the user.
 *
 * @returns {Promise<number>} - Id of the created user.
 */
const create = async ({
  name,
  auth0id,
  email,
}) => {
  try {
    const [id] = await getKnex()(tables.users)
      .insert({
        name,
        auth0id,
        email,
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

/**
 * Update a user with the given `id`.
 *
 * @param {number} id - Id of the user to update.
 * @param {object} user - User to save.
 * @param {string} user.name - Name of the user.
 *
 * @returns {Promise<number>} - Id of the updated user.
 */
const updateById = async (id, {
  name,
  email,
  auth0id,
}) => {
  try {
    await getKnex()(tables.users)
      .update({
        name,
        auth0id,
      })
      .where('id', id);
    return id;
  } catch (error) {
    const logger = getLogger();
    logger.error('Error in updateById', {
      error,
    });
    throw error;
  }
};

/**
 * Update a user with the given `id`.
 *
 * @param {string} id - Id of the user to delete.
 */
const deleteById = async (id) => {
  try {
    const rowsAffected = await getKnex()(tables.users)
      .delete()
      .where('id', id);
    return rowsAffected > 0;
  } catch (error) {
    const logger = getLogger();
    logger.error('Error in deleteById', {
      error,
    });
    throw error;
  }
};

module.exports = {
  findAll,
  findCount,
  findById,
  findByAuth0Id,
  findByEmail,
  create,
  updateById,
  deleteById,
};