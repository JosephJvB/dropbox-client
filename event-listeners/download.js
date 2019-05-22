const prompts = require('prompts')

const dbxRequest = require('../http');

module.exports = async function download (file) {

  let confirmCancelled = false;
  const confirmRename = await prompts({
      type: 'confirm',
      name: 'yes',
      message: `Rename file ${file.name}? [y/n]`
  }, {
      onCancel: () => { confirmCancelled = true; return true; }
  });

  if(confirmCancelled) {
    confirmCancelled = false;
    this.emit('CLEAR_SCREEN');
    return;
  }

  let renameCancelled = false;
  if(confirmRename.yes) {
    const renameChoice = await prompts({
        type: 'text',
        name: 'fileName',
        message: 'Enter new filename:'
    }, {
        onCancel: () => { renameCancelled = true; return true; }
    });

    if(renameCancelled) {
      renameCancelled = false;
      this.emit('CLEAR_SCREEN');
      return;
    }

    // make sure user doesnt accidentally change filetype..
    const ext = file.path_lower.split('.').pop()
    const newName = renameChoice.fileName.endsWith(ext)
    ? renameChoice.fileName
    : renameChoice.fileName + '.' + ext;

    file.name = newName;
  }

  await dbxRequest.download(file);

  this.emit('AWAIT_CMD');
}
