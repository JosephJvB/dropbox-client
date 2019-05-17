const prompts = require('prompts');

const listContents = require('../http/list');

const messageText = 'jvb@dbx~$';

const cache = {};

exports.promptFileAction = async function promptFileAction (file) {

  clearScreenAndPrintTitle(file.path_lower);

  const chosen = await prompts({
    type: 'select',
    name: 'value',
    message: messageText,
    choices: [
      {title: 'download', value: 'download'},
      {title: 'info', value: 'info'},
      {title: 'cancel', value: 'cancel'},
      {title: 'exit', value: 'exit'}
    ]
  }, {
    onCancel: () => { console.log('bye.'); process.exit(0) }
  });

  return chosen.value;
}

exports.promptFileSelection = async function promptFileSelection (filePath = '', preserveLogs) {

  if(!preserveLogs) {
    clearScreenAndPrintTitle(filePath);
  }

  if(!cache[filePath]) {
    cache[filePath] = await listContents(filePath);
  }

  const contentsChoices = cache[filePath].map(f => ({
    // folders display title end in '/'
      title: f['.tag'] === 'folder' ? f.name + '/' : f.name,
      value: f
  }));
  const choicesAndNav = [
      ...contentsChoices,
      {title: 'cd ..', value: {'.tag':'back', 'path_lower': filePath}},
      {title: 'exit', value: {'.tag': 'exit'}}
  ];

  const chosen = await prompts({
      type: 'select',
      name: 'value',
      message: messageText,
      choices: choicesAndNav,
      initial: 0
  }, {
      onRender: () => process.exit(1),
      onCancel: () => { console.log('bye.'); process.exit(0) }
  }); 

  return chosen.value;
}

function clearScreenAndPrintTitle (filePath = '/') {
  // clear screen
  // https://stackoverflow.com/questions/9006988/node-js-on-windows-how-to-clear-console#answer-9452971
  const [x, y] = process.stdout.getWindowSize();
  for(let i = 0; i < y; i++) {
      console.log('\033c');
  }
  console.log(`/Apps/[app-folder]${filePath}`);
}