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
  const user = await userRepository.findById(id);
  if (!user) {
    throw ServiceError.notFound(`There is no user with id ${id}`);
  }
  user = formatUser(user);
  return verification = {
    token: undefined,
    validated: true,
    user: user,
  };
};

const getUserWithToken = async (token) => {
  debugLog(`Getting user with token`);
  let decodedUser = jwt.verify(token, process.env.JWT_SECRET);
  let user = await userRepository.findById(decodedUser.id);
  if (!user) {
    throw ServiceError.notFound(`There is no user with token given token`);
  }
  user = formatUser(user);
  return verification = {
    token,
    validated: true,
    user: user,
  };
};

const generateJavaWebToken = async (user) => {
  debugLog(`Generating JWT for ${user.name}`);
  const jwtPackage = {
    id: user.id,
    name: user.name,
    email: user.email,
  };
  const token = jwt.sign(jwtPackage, process.env.JWT_SECRET, {
    expiresIn: "8h",
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
    user: undefined,
  };
  let userWithoutPlanets = await userRepository.findByMail(email);
  if (!userWithoutPlanets) {
    throw ServiceError.forbidden(`There is no user with email ${email}`);
  }
  let user = await userRepository.findById(userWithoutPlanets.id);
  const result = user.hash === crypto.pbkdf2Sync(password, user.salt, 10000, 64, 'sha256').toString('base64');
  if (result) {
    const token = await generateJavaWebToken(user);
    verification.token = token;
    verification.validated = true;
    verification.user = formatUser(user);
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
  logger = getLogger();
  logger.info(`Creating new user with name ${name}`);
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

    debugLog(`Created user with name ${name}`);

    const token = await generateJavaWebToken(user);


    const verification = {
      token: token,
      validated: true,
      user: formatUser(user),
    };

    return verification;
  } catch (error) {
    if (error.message === 'DUPLICATE_ENTRY') {
      throw ServiceError.duplicateEntry(`User already exists`, { email });
    } else {
      throw ServiceError.validationFailed(error.message);
    }
  }
};


module.exports = {
  register,
  login,
  getUserById,
  getUserWithToken,
};