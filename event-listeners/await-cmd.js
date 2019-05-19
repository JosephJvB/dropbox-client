const prompts = require('prompts');

const { getCache } = require('../lib/cache');

const defaultMsg = 'cli@dbx~$';

// let cache

module.exports = async function awaitCmd () {

  const cache = getCache();

  const dbxFileChoices = cache[cache.cwd] ? cache[cache.cwd] : [];
  const navChoices = [
    {title: '..', value: {evt: 'BACK', cwd: cache.cwd}, type: 'nav'},
        {title: '~', value: {evt: 'HOME', cwd: cache.cwd}, type: 'nav'}
  ];
  const choices = [
    {title: 'upload', value: {evt: 'UPLOAD'}, type: 'cmd'},
    {title: 'quit', value: {evt: 'QUIT'}, type: 'cmd'},
    {title: 'help', value: {evt: 'SHOW_HELP'}, type: 'cmd'},
    // i can have more than one choice doing the same event
    // {title: 'exit', value: {evt: 'QUIT'}, type: 'cmd'},
  ];
  
  // let grabbedInput = '';
  const suggestFn = async (inputRaw, opts) => {
    if(inputRaw.length < 2) return [];
    const input = inputRaw
    .split(' ')[0] // dunno if I need this.. better save than sorry
    .toLowerCase();

    // grabbedInput = input;

    // special cases: display options that arent the options title
    if(input === 'ls') {
      // only show file / folder options
      return dbxFileChoices.map(o => {
          if(o.type === 'folder') {
            o.value.evt = 'CHANGE_DIR';
          } else if (o.type === 'file') {
            o.value.evt = 'INFO';
          }
          return o;
        });
    } else if(input === 'cd') {
      return [
        ...dbxFileChoices.filter(o => o.type === 'folder').map(o => {
          o.value.evt = 'CHANGE_DIR';
          return o;
        }),
        ...navChoices
      ];
    } else if ('info'.includes(input)) {
      return dbxFileChoices.map(o => {
        o.value.evt = 'INFO';
        return o;
      });
    } else if ('download'.includes(input)) {
      return dbxFileChoices.filter(o => o.type ==='file').map(o => {
        o.value.evt = 'DOWNLOAD';
        return o;
      });
    } else {
      // display valid options by title
      return opts.filter(o => o.title.includes(input)).map(o => {
        if(o.type === 'folder') {
          o.value.evt = 'CHANGE_DIR';
        } else if (o.type === 'file') {
          o.value.evt = 'INFO';
        }
        return o;
      });
    }
  }

  let hasCancelled = false;
  const chosenCmd = await prompts({
    type: 'autocomplete',
    name: 'value',
    choices,
    limit: process.stdout.getWindowSize()[1] - 3,
    message: defaultMsg,
    suggest: suggestFn,
  }, {
    onCancel: () => {
      hasCancelled = true;
      return true;
    }
  });
  
  if(hasCancelled) {
    hasCancelled = false;
    setTimeout(() => console.log('"quit" to exit the cli'), 50);
    this.emit('CLEAR_SCREEN');
    return;
  }
  
  if(!chosenCmd.value) {
    setTimeout(() => console.log(`
    Command not recognized,
    "help" to see usage or "quit" to exit the cli
    `), 50);
    this.emit('AWAIT_CMD');
    return;
  }
  
  // add check: if !evts.includes(chosen.evt) error:
  this.emit(chosenCmd.value.evt, chosenCmd.value);
  return;
}
