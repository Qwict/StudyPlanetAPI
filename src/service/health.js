const packageJson = require('../../package.json');

/**
 * Check if the server is healthy. Can be extended
 * with database connection check, etc.
 */
const ping = () => ({
  pong: true
});

/**
 * Get the running server's information.
 */
// const getVersion = () => ({
//   env: process.env.NODE_ENV,
//   version: packageJson.version,
//   name: packageJson.name,
//   androidVersion: getAndroidVersion(),
// });

async function getVersion() {
  let androidVersion = '0.0.0';
  let iosVersion = '0.0.0';
  await fetch('https://api.github.com/repos/qwict/StudyPlanetAndroid/tags', {
    method: 'GET',
  })
    .then((response) => response.json())
    .then((json) => androidVersion = json[0].name);

  await fetch('https://api.github.com/repos/qwict/StudyPlanetiOS/tags', {
    method: 'GET',
  })
    .then((response) => response.json())
    .then((json) => iosVersion = json[0].name);

  androidVersion = androidVersion.replace('v', '');
  iosVersion = iosVersion.replace('v', '');

  return {
    env: process.env.NODE_ENV,
    version: packageJson.version,
    name: packageJson.name,
    androidVersion: androidVersion,
    iosVersion: iosVersion
  }
}

module.exports = {
  ping,
  getVersion,
};