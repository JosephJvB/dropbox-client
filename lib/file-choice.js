const prompts = require('prompts');

const handleDownload = require('./download');
const writeInfo = require('./info');

module.exports = async function handleFileChoice (filePath) {
  const choice = await prompts({
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

  const currentPathArr = filePath.split('/');
  const prevDir = currentPathArr.slice(0, currentPathArr.length - 1).join('/');

  const handleInfo = () => {
    return writeInfo(filePath)
    .then(() => require('./connect')(prevDir))
  }

  const handleCancel = () => {
    return require('./connect')(prevDir);
  }

  switch(choice.value) {
    case 'download': handleDownload(filePath);
      break;
    case 'info': handleInfo();
      break;
    case 'cancel': handleCancel(prevDir);
      break;
    case 'exit': {
      console.log('exiting...');
      process.exit(0);
    }
  }
}
