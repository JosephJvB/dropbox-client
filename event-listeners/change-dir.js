const { setCache } = require('../lib/cache');

module.exports = async function changeDir (file) {
  await setCache(file.path_lower);
  this.emit('CLEAR_SCREEN');
  return;
}
