const prompts = require('prompts');

const { getCache } = require('../lib/cache');

const defaultMsg = 'cli@dbx~$';

module.exports = async function awaitCmd () {

  const cache = getCache();

  const cachedDbxContents = cache[cache.cwd] ? cache[cache.cwd] : [];
  const navChoices = [
    {title: '..', value: {evt: 'CHANGE_DIR', path_lower: getPrevDir(cache.cwd)}, type: 'nav'},
    {title: '~', value: {evt: 'CHANGE_DIR', path_lower: ''}, type: 'nav'}
  ];
  // i can have more than one choice doing the same event
  // {title: 'exit', value: {evt: 'QUIT'}, type: 'cmd'},
  const defaultChoices = [ 
    {title: 'upload', value: {evt: 'UPLOAD'}, type: 'cmd'},
    {title: 'quit', value: {evt: 'QUIT'}, type: 'cmd'},
    {title: 'help', value: {evt: 'SHOW_HELP'}, type: 'cmd'},
  ];
  const all = [
    ...cachedDbxContents.folders,
    ...cachedDbxContents.files,
    ...defaultChoices,
    ...navChoices
  ]
  
  // Offer different suggestions based on user input
  const suggestFn = async (inputRaw) => {
    if(inputRaw.length < 2) return [];
    const input = inputRaw
    .split(' ')[0] // dunno if I need this.. better safe than sorry
    .toLowerCase();

    if(input ==='ls') return [...cachedDbxContents.folders, ...cachedDbxContents.files];
    if(input ==='cd') return [...cachedDbxContents.folders, ...navChoices];
    if('download'.includes(input)) return cachedDbxContents.files.map(f => {
      f.value.evt = 'DOWNLOAD'
      return f;
    });
    else return all.filter(o => o.title.includes(input));
  }

  let hasCancelled = false;
  const chosenCmd = await prompts({
    type: 'autocomplete',
    name: 'value',
    choices: defaultChoices,
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

function getPrevDir (path) {
  const currentPathArr = path.split('/');
  return currentPathArr.slice(0, currentPathArr.length - 1).join('/');
}