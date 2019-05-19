#! /usr/bin/env node
const {
  checkTokenExists,
  promptSetToken,
  loadToken,
  deleteToken
} = require('./lib/token');
const connectCli = require('./lib/connect');

(async function init () {
  // load token to process.env
  if(!await checkTokenExists()) {
    await promptSetToken({required: true});
  }
  await loadToken();
  // handle first args
  const cmds = [];
  const flags = [];
  for(arg of process.argv.slice(2)) {
      arg[0] === '-'
      ? flags.push(arg)
      : cmds.push(arg)
  }
  const [action] = cmds;
  const helpArgs = ['-h', 'elp'];
  const help = flags.find(a => helpArgs.includes(a.toLowerCase())); 

  if(!action || help) {
    return console.log(helpText);
  }

  switch(action.toLowerCase()) {
    case 'connect': connectCli();
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