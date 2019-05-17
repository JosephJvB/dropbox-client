const prompts = require('prompts');

const listContents = require('./list');
const writeInfo = require('./info');
const handleFileChoice = require('./file-choice')
const {
    promptFileAction,
    promptFileSelection
} = require('./prompt-util');

// const currentPathArr = filePath.split('/');
// const prevDir = currentPathArr.slice(0, currentPathArr.length - 1).join('/');

const handleInfo = async (file) => {
    await writeInfo(file.id)
    return promptFileAction(file, true);
}

module.exports = async function connect () {
    const chosenFile = await promptFileSelection();
    if(chosenFile['.tag'] === 'file') {
        const chosenAction = await promptFileAction(chosenFile);
        switch(chosenAction) {
            case 'info': return handleInfo(chosenFile);
            case 'download': return 'download and exit';
            case 'cancel': return 'prompt fileSelction @ prev dir';
            default: {
              console.error('wtf?', choice);
              process.exit(1);
            }
        }
    } else if (type === 'folder') {

    } else {
        console.error('wtf?', chosen['.tag']);
        process.exit(1);
    }
}