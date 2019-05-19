const EventEmitter = require('events');

const listeners = require('../event-listeners');

module.exports = async function connectCli () {
  const cli = new EventListener();
  cli.on('AWAIT_CMD', listeners.awaitCmd);
  cli.on('DOWNLOAD', listeners.download);
  cli.on('UPLOAD', listeners.upload);
  cli.on('INFO', listeners.info);
  cli.on('GET_CACHE', listeners.getCache);
  cli.on('SET_CACHE', listeners.setCache);
  cli.on('CLEAR_SCREEN', listeners.clearScreen);
  cli.on('SHOW_HELP', showHelp);
  cli.on('QUIT', () => {
    console.log('exiting...')
    process.exit(0);
  });

  // set cache for root
  cli.emit('SET_CACHE', {cwd: ''});
  cli.emit('AWAIT_CMD');
  return;
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