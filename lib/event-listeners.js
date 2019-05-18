const {
  promptFileSelection,
  promptFileAction,
  promptUpload
} = require('./prompt-util');
const dbxRequest = require('../http');

exports.listContentsListener = async function listContentsListener (file = {}, preserveLogs = false) {
  const chosenFile = await promptFileSelection(file.path_lower, preserveLogs);

  let nextEvent = ''
  switch(chosenFile['.tag']) {
    case 'file': nextEvent = 'LIST_FILE_ACTIONS';
      break;
    case 'folder': nextEvent = 'LIST_CONTENTS';
      break;
    // case 'upload': nextEvent = 'UPLOAD';
    //   break;
    case 'back': nextEvent = 'BACK';
      break;
    case 'exit': nextEvent = 'EXIT';
      break;
    default: {
      console.error('wtf?');
      process.exit(1);
    }
  }
  this.emit(nextEvent, chosenFile);
}

exports.listFileActionsListener = async function listFileActionsListener (file, preserveLogs = false) {
  const chosenAction = await promptFileAction(file, preserveLogs);

  let nextEvent = '';
  switch(chosenAction) {
    case 'info': nextEvent = 'INFO';
      break;
    case 'download': nextEvent = 'DOWNLOAD';
      break;
    case 'cancel': nextEvent = 'BACK';
      break;
    case 'exit': nextEvent = 'EXIT';
      break;
    default: {
      console.error('wtf?');
      process.exit(1);
    }
  }

  this.emit(nextEvent, file);
}

exports.showInfoListener = async function showInfoListener (file) {
  await dbxRequest.info(file.id);
  // dont go back a dir after info
  // const fileData = { path_lower: getPrevDir(file) };
  
  this.emit('LIST_FILE_ACTIONS', file, true)
}

exports.downloadListener = async function downloadListener (file) {
  await dbxRequest.download(file.path_lower);
  const fileData = { path_lower: getPrevDir(file) };

  this.emit('LIST_CONTENTS', fileData, true);
}

exports.uploadListener = async function uploadListener (file) {
  await promptUpload(file);
  // need to force update cache here
  this.emit('LIST_CONTENTS', file);
}

exports.waitGoBack = async function waitGoBack (file) {
  const fileData = { path_lower: getPrevDir(file) };
  this.emit('LIST_CONTENTS', fileData);
}

exports.handleExit = function handleExit() {
  console.log('bye.');
  process.exit(0);
}

function getPrevDir (file) {
  const currentPathArr = file.path_lower.split('/');
  return currentPathArr.slice(0, currentPathArr.length - 1).join('/');    
}