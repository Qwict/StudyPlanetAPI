const {
  tables,
  getKnex,
} = require('../data');

const {
  getLogger,
} = require('../core/logging');

const getActionByUserId = async (userId) => {
  try {
    const action = await getKnex()(tables.actions)
      .where('user_id', userId)
      .first();
    return action;
  } catch (error) {
    const logger = getLogger();
    logger.error('Error in getAction', {
      error,
    });
    throw error;
  }
};

const createActionByUserId = async (userId, newAction) => {
  try {
    await getKnex()(tables.actions)
      .where('user_id', userId)
      .update(newAction);
  } catch (error) {
    const logger = getLogger();
    logger.debug('Creating new action for new user');
    await getKnex()(tables.actions)
      .insert({
        user_id: userId,
        ...newAction,
      });
  }
};

module.exports = {
  getActionByUserId,
  createActionByUserId,
};