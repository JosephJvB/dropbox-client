const EventEmitter = require('events');

const listeners = require('../event-listeners');
const { setCache } = require('./cache');

module.exports = async function connectCli () {
  const cli = new EventEmitter();
  cli.on('AWAIT_CMD', listeners.awaitCmd);
  cli.on('DOWNLOAD', listeners.download);
  cli.on('UPLOAD', listeners.upload);
  cli.on('INFO', listeners.info);
  cli.on('CHANGE_DIR', listeners.changeDir);
  cli.on('BACK', listeners.back);
  cli.on('HOME', listeners.home);
  cli.on('CLEAR_SCREEN', listeners.clearScreen);
  cli.on('SHOW_HELP', showHelp);
  cli.on('QUIT', () => {
    console.log('exiting...')
    process.exit(0);
  });

  // set cache for root
  await setCache('');
  cli.emit('CLEAR_SCREEN');
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
  this.emit('AWAIT_CMD');
} 