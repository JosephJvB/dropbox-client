const prompts = require('prompts');

module.exports = async function handleFileSelect (file) {
  const choice = await prompts({
    type: 'select',
    name: 'value',
    message: 'choose file action',
    choices: [
      { title: 'info', value: 'INFO' },
      { title: 'download', value: 'DOWNLOAD' },
      { title: 'cancel', value: 'CLEAR_SCREEN' }
    ]
  });

  this.emit(choice.value, file);
  return;
}