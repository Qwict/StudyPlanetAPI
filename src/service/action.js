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
  // TODO check if selected time is appropriate for discovery
  handleAction(actionType = "start-discover", userId, selectedTime)
};

const stopDiscovering = async (userId) => {
  const logger = getLogger();
  const action = await actionRepository.getActionByUserId(userId);

  // check if selected time was respected
  const actualTimePassed = action.end_time - action.start_time;
  const selectedTime = action.selected_time;

  const margin = 1000 * 60 * 2; // 2 minutes

  const absoluteDifference = Math.abs(actualTimePassed - selectedTime);
  if (absoluteDifference > margin) {
    this.logger.error("Selected time was not respected");
    throw new ServiceError.validationFailed("Selected time was not respected");
  } else {
    const undiscoveredPlanets = await userPlanetRepository.findAllUndiscoverdPlanets(userId);
    if (undiscoveredPlanets.length != 0) {
      logger.info(`Undiscovered planets: ${undiscoveredPlanets.length}`);

      let chanceOfSuccess = 0;
      if (process.env.NODE_ENV === 'development') {
        chanceOfSuccess = 1.0; // for development purposes
      } else {
        chanceOfSuccess = (selectedTime / 1000 / 60) / 30 / 5; // 30 minutes will give a 20 % chance of success
      }

      if (Math.random() > chanceOfSuccess) {
        logger.info(`No planet was discovered with chance: ${chanceOfSuccess}`);
        return;
      }

      // select random planet from undiscovered planets
      const randomIndex = Math.floor(Math.random() * undiscoveredPlanets.length);
      const randomPlanet = undiscoveredPlanets[randomIndex];

      const planetId = randomPlanet.id
      logger.info(`Random planet: ${randomPlanet.name} with id ${planetId}`);

      // give planet to user
      await userPlanetRepository.createUserPlanet(userId, planetId);
      return randomPlanet;
    } else {
      // The user will just get experience instead of a planet
      logger.info("No undiscovered planets");
      userRepository.addExperience(userId, selectedTime / 1000);
    }
  }

  handleAction(actionType = "stop-discover", userId, selectedTime)
};

const startExploring = async (userId, planetId) => {
  // TODO check if selected time is appropriate for exploration
  handleAction(actionType = "start-explore", userId, selectedTime)
};


const stopExploring = async (userId, planetId) => {


  handleAction(actionType = "stop-explore", userId, selectedTime)
};

async function handleAction(actionType, userId, selectedTime) {
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
  await actionRepository.createActionByUserId(userId, newAction);
}

module.exports = {
  startDiscovering,
  startExploring,
  stopDiscovering,
  stopExploring,
};