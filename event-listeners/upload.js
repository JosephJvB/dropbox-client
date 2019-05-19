const prompts = require('prompts');

const dbxRequest = require('../http');

module.exports = async function upload (evt) {
  const cache = this.emit('GET_CACHE')
  console.log('Uploading to ', cache.cwd);

  let uploadCancelled = false;
  const userInput = await prompts({
    type: 'text',
    name: 'value',
    message: 'Enter file-path or url:\nrename using --as flag'
  }, {
    onCancel: () => { uploadCancelled = true; return true; }
  });

  if(uploadCancelled) {
    uploadCancelled = false;
    this.emit('CLEAR_SCREEN');
    return;
  }

  const value = userInput.value.split(' ')
  const [ref] = value;
  const asIdx = args.findIndex(a => a === '--as');
  const saveAsName = asIdx > 0 ? args[asIdx + 1] : null;

  let fileName = '';
  if(saveAsName) {
    fileName = saveAsName
  } else {
    const fileNameArr = ref.split('/');
    fileName = fileNameArr[pathArr.length - 1];
  }

  await dbxRequest.upload(chosen.fileReference, fileName);

  // update cache @ cwd
  this.emit('SET_CACHE', {cwd: cache.cwd}, true)
  this.emit('CLEAR_SCREEN');
}