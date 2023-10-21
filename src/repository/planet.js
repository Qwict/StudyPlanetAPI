const {
  tables,
  getKnex,
} = require('../data');
const {
  getLogger,
} = require('../core/logging');

const findById = (id) => {
  const planet = getKnex()(tables.planets)
    .where('id', id)
    .first();
  return planet;
}

const findAll = () => {
  const planets = getKnex()(tables.planets)
    .select();
  return planets;
}


module.exports = {
  findById,
  findAll,
};