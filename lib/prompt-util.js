const prompts = require('prompts');

const listContents = require('./list');

exports.promptFileAction = async function promptFileAction (file, preserveLogs = false) {

  if(!preserveLogs) {
    clearScreenAndPrintTitle(file.name);
  }

  const chosen = await prompts({
    type: 'select',
    name: 'value',
    message: 'Choose action:',
    choices: [
      {title: 'download', value: 'download'},
      {title: 'info', value: 'info'},
      {title: 'cancel', value: 'cancel'},
      {title: 'exit', value: 'exit'}
    ]
  }, {
    onCancel: () => { console.log('bye.'); process.exit(0) }
  })

  return chosen.value;
}

exports.promptFileSelection = async function promptFileSelection (file = {}) {

  clearScreenAndPrintTitle(file.filePath);

  const dbxContents = await listContents(file.filePath);
  const contentsChoices = dbxContents.map(f => ({
    // folders display title end in '/'
      title: f['.tag'] === 'folder' ? f.name + '/' : f.name,
      value: f
  }));
  const choicesAndNav = [
      ...contentsChoices,
      {title: 'cd ..', value: {'.tag':'back'}},
      {title: 'exit', value: {'.tag': 'exit'}}
  ];

  const messageText = 'jvb@dbx~$';

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

  return chosen.value
}

function clearScreenAndPrintTitle (filePath = '/') {
  // clear screen
  // https://stackoverflow.com/questions/9006988/node-js-on-windows-how-to-clear-console#answer-9452971
  const [x, y] = process.stdout.getWindowSize();
  for(let i = 0; i < y; i++) {
      console.log('\033c');
  }
  console.log(`/Apps/[app-folder]/${filePath}`);
}