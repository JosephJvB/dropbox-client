const prompts = require('prompts');

const dbxRequest = require('../http');
const { setCache, getCache } = require('../lib/cache');

module.exports = async function upload () {
  const cache = getCache();
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

  const args = userInput.value.split(' ')
  const [ref] = args;
  const asIdx = args.findIndex(a => a === '--as');
  const saveAsName = asIdx > 0 ? args[asIdx + 1] : null;

  let fileName = '';
  if(saveAsName) {
    fileName = saveAsName
  } else {
    const fileNameArr = ref.split('/');
    fileName = fileNameArr[fileNameArr.length - 1];
  }

  await dbxRequest.upload(ref, fileName);

  // update cache @ cwd
  await setCache(cache.cwd, true);
  this.emit('CLEAR_SCREEN');
}