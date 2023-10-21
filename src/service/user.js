const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const {
  getLogger,
} = require('../core/logging');
const ServiceError = require('../core/serviceError');
const userRepository = require('../repository/user');

formatUser = (user) => {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    experience: user.experience,
    discoveredPlanets: user.discoveredPlanets,
  };
}

const debugLog = (message, meta = {}) => {
  if (!this.logger) this.logger = getLogger();
  this.logger.debug(message, meta);
};

const getUserById = async (id) => {
  debugLog(`Getting user with id ${id}`);
  let user = await userRepository.findById(id);
  if (!user) {
    throw ServiceError.notFound(`There is no user with id ${id}`);
  }
  console.log("USER", user)
  user = formatUser(user);
  console.log("USER", user)
  return user;
};

const generateJavaWebToken = async (user) => {
  debugLog(`Generating JWT for ${user.email}`);
  const jwtPackage = {
    id: user.id,
    name: user.name,
    email: user.email,
  };
  const token = jwt.sign(jwtPackage, process.env.JWT_SECRET, {
    expiresIn: 36000,
    // issuer: process.env.AUTH_ISSUER,
    // audience: process.env.AUTH_AUDIENCE,
  });
  return token;
};

const login = async ({
  email,
  password,
}) => {
  debugLog(`Verifying user with email ${email}`);
  const verification = {
    token: undefined,
    validated: false,
  };
  const user = await userRepository.findByMail(email);

  if (!user) {
    throw ServiceError.notFound(`There is no user with email ${email}`);
  }
  const result = user.hash === crypto.pbkdf2Sync(password, user.salt, 10000, 64, 'sha256').toString('base64');
  if (result) {
    const token = await generateJavaWebToken(user);
    verification.token = token;
    verification.validated = true;
    verification.user = user;
  } else {
    throw ServiceError.forbidden(`Verification failed for user with email ${email}`);
  }

  return verification;
};

const register = async ({
  name,
  email,
  password,
}) => {
  debugLog(`Creating user with name ${name} and email ${email}`);
  const salt = crypto.randomBytes(128).toString('base64');
  const hash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha256').toString('base64');

  const newUser = {
    name,
    email,
    salt,
    hash,
  };
  try {
    const user = await userRepository.create(newUser);

    const jwtPackage = {
      name: user.name,
      email: user.email,
      permission: user.role,
    };

    notificationFactory.create({
      userId: user.id,
      date: new Date().toString(),
      audience: 'private',
      subject: 'Welcome!',
      text: `Welcome to delaware shipping, ${user.name ? user.name : user.email}`,
    });
    return jwt.sign(jwtPackage, process.env.JWT_SECRET, {
      expiresIn: 36000,
      issuer: process.env.AUTH_ISSUER,
      audience: process.env.AUTH_AUDIENCE,
    });
  } catch (error) {
    if (error.message === 'DUPLICATE_ENTRY') {
      throw ServiceError.duplicate('DUPLICATE ENTRY');
    } else {
      throw ServiceError.validationFailed(error.message);
    }
  }
};

const startExploring = async (planetId, ctx) => {
  const logger = getLogger();

  // get user from database

  // const user = await userRepository.findById(ctx.state.user.auth0id);
  logger.info(`USER:`);

  // check if user is not currently exploring or discovering

  // check if user has relation with planet

  logger.info(`START EXPLORING`);
};

const stopExploring = async () => {
  const logger = getLogger();
  logger.info(`STOP EXPLORING`);
};

const startDiscovering = async () => {
  const logger = getLogger();
  logger.info(`START DISCOVERING`);
};

const stopDiscovering = async () => {
  const logger = getLogger();
  logger.info(`STOP DISCOVERING`);
  // get array of planets that are not discovered yet by the user

  // depending on selected time create percentage chance of discovering a planet

  // if planet is discovered create relation between user and planet
};


module.exports = {
  register,
  login,
  getUserById,
};