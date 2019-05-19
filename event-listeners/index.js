const {
  getCache,
  setCache, 
} = require('./cache');

module.exports = {
  awaitCmd: require('./await-cmd'),
  download: require('./download'),
  upload: require('./upload'),
  info: require('./info'),
  getCache,
  setCache,
  clearScreen: require('./clear-screen')
}