const EventEmitter = require('events');

const listeners = require('../event-listeners');
const { setCache } = require('./cache');

module.exports = async function connectCli () {
  const cli = new EventEmitter();
  cli.on('AWAIT_CMD', listeners.awaitCmd);
  cli.on('DOWNLOAD', listeners.download);
  cli.on('UPLOAD', listeners.upload);
  cli.on('INFO', listeners.info);
  cli.on('FILE_SELECT', listeners.fileSelect);
  cli.on('CHANGE_DIR', listeners.changeDir);
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
      - cd
      - ls
      - quit
      - help
  `);
  this.emit('AWAIT_CMD');
} 