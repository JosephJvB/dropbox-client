const prompts = require('prompts');
const dbxRequest = require('../http');

const defaultMsg = 'cli@dbx~$';

let cache = {};
let CWD = '';

module.exports = async function awaitCmd () {
  // const cache = this.emit('GET_CACHE');
  // const CWD = this.emit('GET_CWD'); // current working directory
  if(!cache['']) {
    cache[''] = await dbxRequest.list();
  }

  const currentChoices = cache[CWD]
  ? cache[CWD].map(doc => {
    return {
      title: `${doc.name}${doc['.tag'] === 'folder' ? '/' : ''}`,
      value: { ...doc, evt: '' },
      type: doc['.tag'],
    };
  })
  : [];

  const choices = [
    {title: 'upload', value: {evt: 'UPLOAD'}, type: 'cmd'},
    {title: 'quit', value: {evt: 'QUIT'}, type: 'cmd'},
    // i can have more than one choice doing the same event
    // {title: 'exit', value: {evt: 'QUIT'}, type: 'cmd'},
    {title: 'help', value: {evt: 'SHOW_HELP'}, type: 'cmd'},
    ...currentChoices
  ];
  
  const suggestFn = async (inputRaw, opts) => {
    const input = inputRaw.toLowerCase();
    if(input.length < 2) return [];

    // special cases: display options that arent the options title
    if(input === 'cd') {
      return opts.filter(o => o.type === 'folder').map(o => {
        o.value.evt = 'SET_CWD';
        return o;
      });
    } else if ('info'.includes(input)) {
      return opts.filter(o => (o.type === 'folder' || o.type ==='file')).map(o => {
        o.value.evt = 'INFO';
        return o;
      });
    } else if ('download'.includes(input)) {
      return opts.filter(o => o.type ==='file').map(o => {
        o.value.evt = 'DOWNLOAD';
        return o;
      });
    } else {
      // display valid options by title
      return opts.filter(o => o.title.includes(input));
    }
  }

  let hasCancelled = false;
  const chosenCmd = await prompts({
    type: 'autocomplete',
    name: 'value',
    choices,
    message: defaultMsg,
    suggest: suggestFn,
  }, {
    onCancel: () => {
      hasCancelled = true;
      return true;
    }
  });
  
  if(hasCancelled) {
    setTimeout(() => console.log('"quit" to exit the cli, or double tap ctrl+c'), 50);
    this.emit('CLEAR_SCREEN');
    this.emit('AWAIT_CMD');
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

  this.emit(chosenCmd.value.evt, chosenCmd.value);
  return;
}
