const {
  getLogger,
} = require('../core/logging');
const ServiceError = require('../core/serviceError');
const actionRepository = require('../repository/action');
const userPlanetRepository = require('../repository/usersPlanets');
const userRepository = require('../repository/user');

const debugLog = (message, meta = {}) => {
  if (!this.logger) this.logger = getLogger();
  this.logger.debug(message, meta);
};

const startDiscovering = async (userId, selectedTime) => {
  const logger = getLogger();
  logger.info(`Discover chance:  ${(Math.round((selectedTime / 1000 / 60) / 30 / 2) / 100).toFixed(2)}%`)
  handleAction(actionType = "start-discover", userId, selectedTime)
};

const stopDiscovering = async (userId) => {
  const emptyPlanet = { id: 0, name: "" }
  let hasFoundNewPlanet = false;
  let randomPlanet = emptyPlanet;

  const logger = getLogger();

  const action = await actionRepository.getActionByUserId(userId);
  const selectedTime = action.selected_time;
  validateActionByUserId(action);

  handleAction(actionType = "stop-discover", userId, selectedTime)
  const undiscoveredPlanets = await userPlanetRepository.findAllUndiscoverdPlanets(userId);
  logger.info(`User with id: ${userId} has ${undiscoveredPlanets.length} undiscovered planets`)
  if (!action.discovering) {
    logger.warn("User was not discovering and requested to stop discovery");
    return {
      hasFoundNewPlanet: hasFoundNewPlanet,
      planet: randomPlanet,
    }
  }

  if (undiscoveredPlanets.length != 0) {
    logger.info(`Undiscovered planets: ${undiscoveredPlanets.length}`);

    let chanceOfSuccess = 0;
    if (process.env.NODE_ENV === 'development') {
      chanceOfSuccess = 1.0; // for development purposes
    } else {
      chanceOfSuccess = (selectedTime / 1000 / 60) / 30 / 2; // 30 minutes will give a 50 % chance of success
    }

    if (Math.random() > chanceOfSuccess) {
      logger.info(`No planet was discovered with chance: ${chanceOfSuccess}`);
    } else {
      // select random planet from undiscovered planets
      const randomIndex = Math.floor(Math.random() * undiscoveredPlanets.length);
      randomPlanet = undiscoveredPlanets[randomIndex];

      const planetId = randomPlanet.id
      logger.debug(`Random planet: ${randomPlanet.name} with id ${planetId}`);

      // give planet to user
      await userPlanetRepository.createUserPlanet(userId, planetId);
      hasFoundNewPlanet = true
    }
  }

  let experience = action.selected_time / 1000 / 60;
  // add experience to user
  await userRepository.addExperience(userId, experience);

  return {
    hasFoundNewPlanet: hasFoundNewPlanet,
    experience: experience,
    planet: randomPlanet,
  }


};

const startExploring = async (userId, planetId, selectedTime) => {
  await validateUserHasPlanetRelation(userId, planetId)
  await handleAction(actionType = "start-explore", userId, selectedTime)
  // TODO check if selected time is appropriate for exploration
};


const stopExploring = async (userId) => {
  let action = await actionRepository.getActionByUserId(userId);

  validateActionByUserId(action);
  let experience = action.selected_time / 1000 / 60;
  await userRepository.addExperience(userId, experience);

  const selectedTime = action.selected_time;
  await handleAction(actionType = "stop-explore", userId, selectedTime)
  return {
    experience: experience
  }
};

async function handleAction(actionType, userId, selectedTime) {
  debugLog("HANDLE ACTION: with selected time: " + selectedTime / 1000 / 60 + "minutes, " + selectedTime / 1000 / 60 + " xp")
  let discovering = false;
  let exploring = false;
  switch (actionType) {
    case "start-discover":
      debugLog("START DISCOVER ACTION")
      discovering = true;
      break;
    case "stop-discover":
      debugLog("STOP DISCOVER ACTION")
      discovering = false;
      break;
    case "start-explore":
      debugLog("START EXPLORE ACTION")
      exploring = true;
      break;
    case "stop-explore":
      debugLog("STOP EXPLORE ACTION")
      exploring = false;
      break;
  }

  const newAction = {
    selected_time: selectedTime,
    start_time: Date.now(),
    end_time: Date.now() + selectedTime,
    discovering: discovering,
    exploring: exploring,
  }
  debugLog("NEW ACTION FOR USER: " + userId + " " + JSON.stringify(newAction))

  await actionRepository.createActionByUserId(userId, newAction);
}

function validateActionByUserId(action) {
  const logger = getLogger()
  // check if selected time was respected
  const actualTimePassed = Date.now() - action.start_time;
  logger.debug(`Validating action: ActualTimePassed = ${actualTimePassed / 1000} seconds`)

  const selectedTime = action.selected_time;

  const margin = 1000 * 60 * 2; // 2 minutes

  const absoluteDifference = Math.abs(actualTimePassed - selectedTime);
  logger.debug(`Validating action: AbsoluteDifference = ${absoluteDifference / 1000} seconds`)
  if (absoluteDifference > margin) {
    logger.warn(`Selected time was not respected: AbsoluteDifference = ${absoluteDifference / 1000} seconds`);
    throw ServiceError.validationFailed(`Selected time was not respected: AbsoluteDifference = ${absoluteDifference / 1000} seconds`);
  }
}

const validateUserHasPlanetRelation = async (userId, planetId) => {
  planets = await userPlanetRepository.findAllUserPlanets(userId);
  let userHasPlanet = planets.filter(planet => planet.id == planetId).length > 0;
  if (!userHasPlanet) {
    throw ServiceError.validationFailed("User does not own this planet");
  }
}

module.exports = {
  startDiscovering,
  startExploring,
  stopDiscovering,
  stopExploring,
};