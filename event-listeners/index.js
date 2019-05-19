const {
  getCache,
  setCache, 
  setCwd,
  getCwd
} = require('./cache');

module.exports = {
  awaitText: require('./await-cmd'),
  download: require('./download'),
  upload: require('./upload'),
  info: require('./info'),
  setCwd,
  getCwd,
  getCache,
  setCache,
  clearScreen: require('./clear-screen')
}