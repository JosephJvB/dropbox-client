#! /usr/bin/env node
const eventEmitter = require('events');

const {
  listContentsListener,
  listFileActionsListener,
  showInfoListener,
  downloadListener,
  waitGoBack,
  handleExit
} = require('./lib/event-listeners')

const {
  checkTokenExists,
  promptSetToken,
  loadToken,
  deleteToken
} = require('./lib/token');

(async function init () {
  // load token to process.env
  if(!await checkTokenExists()) {
    await promptSetToken({required: true});
  }
  await loadToken();

  // register listeners
  const cli = new eventEmitter();
  cli.on('LIST_CONTENTS', listContentsListener);
  cli.on('LIST_FILE_ACTIONS', listFileActionsListener);
  cli.on('INFO', showInfoListener);
  cli.on('DOWNLOAD', downloadListener);
  cli.on('BACK', waitGoBack);
  cli.on('EXIT', handleExit);

  // handle first args
  const cmds = [];
  const flags = [];
  for(arg of process.argv.slice(2)) {
      arg[0] === '-'
      ? flags.push(arg)
      : cmds.push(arg)
  }
  const [action, fileIdentifier] = cmds;
  const asIdx = flags.findIndex(a => a === '--as');
  const saveAsName = asIdx > 0 ? inputArgs[asIdx + 1] : null;
  const helpArgs = ['-h', 'elp'];
  const help = flags.find(a => helpArgs.includes(a.toLowerCase())); 

  switch(action.toLowerCase()) {
    case 'connect': cli.emit('LIST_CONTENTS');
        break;
    case 'token:set': promptSetToken({required:false});
        break;
    case 'token:destroy': deleteToken();
        break;
    case 'error': logError();
        break;
    default: console.log(helpText);
  }
})();


var helpText = `
  key: <> = required, [] = optional

  Usage:

  dbx connect

  dbx token:set
  dbx token:destroy
`;