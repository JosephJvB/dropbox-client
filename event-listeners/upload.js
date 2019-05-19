const prompts = require('./prompts');

const dbxRequest = require('../http');

module.exports = async function upload () {
    console.log('Uploading to ' + this.emit('GET_CWD'));
  
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
      this.emit('AWAIT_TEXT');
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
}