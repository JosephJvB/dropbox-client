const prompts = require('prompts');

const dbxRequest = require('../http');

const messageText = 'cli@dbx~$';

const cache = {};

exports.promptFileAction = async function promptFileAction (file, preserveLogs) {

  if(!preserveLogs) {
    clearScreen();
  }
  printTitle(file.path_lower);

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
    clearScreen();
  }
  printTitle(filePath + '/');

  if(!cache[filePath]) {
    cache[filePath] = await dbxRequest.list(filePath);
  }

  const contentsChoices = cache[filePath].map(f => ({
    // folders display title end in '/'
      title: f['.tag'] === 'folder' ? f.name + '/' : f.name,
      value: f
  }));
  const choicesAndNav = [
      ...contentsChoices,
      // {title: 'upload', value: {'.tag':'upload', 'path_lower': filePath}},
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

exports.promptUpload = async function promptUpload (file) {
  clearScreen();

  const pathArr = file.path_lower.split('/');
  const currentDir = pathArr[pathArr.length - 1] + '/';

  console.log('Uploading to ' + currentDir);

  const chosen = await prompts({
    type: 'text',
    name: 'fileReference',
    message: 'Upload file by path or url:\n'
  }, {
    onCancel: () => { console.log('bye.'); process.exit(0) }
  });

  // TODO: rename
  const fileNameArr = chosen.fileReference.split('/');
  let fileName = fileNameArr[pathArr.length - 1];
  // const rename = await confirmRename(fileName)
  // if(rename) {
  //   fileName = await promptRename();
  // }

  await dbxRequest.upload(chosen.fileReference, fileName);
}

async function confirmRename (fileName) {
  const confirmRename = await prompts({
    type: 'confirm',
    name: 'yes',
    message: `Rename file ${fileName}? [y/n]`
  }, {
    onCancel: () => { console.log('bye.'); process.exit(0) }
  });

  return confirmRename.yes;
}

async function promptRename () {
  const chosen = await prompts({
    type: 'text',
    name: 'newFileName',
    message: `Enter new file name:`
  }, {
    onCancel: () => { console.log('bye.'); process.exit(0) }
  });

  return chosen.newFileName;
}



function clearScreen () {
  // https://stackoverflow.com/questions/9006988/node-js-on-windows-how-to-clear-console#answer-9452971
  const [x, y] = process.stdout.getWindowSize();
  for(let i = 0; i < y; i++) {
      console.log('\033c');
  }
}

function printTitle (filePath) {
  console.log(`/Apps/[app-folder]${filePath}`);
}
