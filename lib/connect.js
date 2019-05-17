const prompts = require('prompts');

const listContents = require('./list');
const handleFileChoice = require('./file-choice')

module.exports = async function connect (filePath = '') {
    const dbxContents = await listContents(filePath, true);
    const choicesAndNav = [
        ...dbxContents.data.map(f => ({title: f.name, value: f})),
        {title: 'cd ..', value: {'.tag':'back'}},
        {title: 'exit', value: {'.tag': 'exit'}}
    ];
    const messageText = `~/app-folder${filePath  || '/'}`;
    // const messageText = 'asdsad' + 'asdasd';

    const chosen = await prompts({
        type: 'select',
        name: 'value',
        message: messageText,
        choices: choicesAndNav,
        initial: 0
    }, {
        onCancel: () => { console.log('bye.'); process.exit(0) }
    });

    const currentPathArr = filePath.split('/');
    const prevDir = currentPathArr.slice(0, currentPathArr.length - 1).join('/');

    switch(chosen.value['.tag'].toLowerCase()) {
        case 'back': connect(prevDir);
            break;
        case 'folder': connect(chosen.value.path_display);
            break;
        case 'file': handleFileChoice(chosen.value.path_display);
            break;
        case 'exit': {
          console.log('bye.');
          process.exit(0);
        }
          break;
    }
}