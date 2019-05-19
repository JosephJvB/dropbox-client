const {
  changeDir,
  back,
  home
} = require('./nav');

module.exports = {
  awaitCmd: require('./await-cmd'),
  download: require('./download'),
  upload: require('./upload'),
  info: require('./info'),
  clearScreen: require('./clear-screen'),
  changeDir,
  back,
  home
}