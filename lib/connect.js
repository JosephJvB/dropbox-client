const EventEmitter = require('events');

const listeners = require('../event-listeners');

module.exports = function connectCli () {
  const cli = new EventListener();
  // cli.on('AWAIT_CMD', listeners.awaitCmd);
  // cli.on('DOWNLOAD', listeners.download);
  // cli.on('UPLOAD', listeners.upload);
  // cli.on('INFO', listeners.info);
  // cli.on('SET_CWD', listeners.setCwd);
  // cli.on('GET_CWD', listeners.getCwd);
  // cli.on('GET_CACHE', listeners.getCache);
  // cli.on('SET_CACHE', listeners.setCache);
  // cli.on('CLEAR_SCREEN', listeners.clearScreen);
  // cli.on('SHOW_HELP', showHelp);
  // cli.on('EXIT', () => {
  //   console.log('exiting...')
  //   process.exit(0);
  // });

  // cli.emit('SET_CACHE', '');
  // cli.emit('AWAIT_CMD');
}

function showHelp () {
  console.log(`
    Commands:
      - upload
      - download
      - info
      - cd
      - quit
      - help
  `);
} 