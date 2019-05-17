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

const handleReturn = async (file) => {
    const currentPathArr = file.path_lower.split('/');
    const prevDir = currentPathArr.slice(0, currentPathArr.length - 1).join('/');
    return promptFileSelection(prevDir);
}

module.exports = async function browseFolder (filePath = '') {
    const chosenFile = await promptFileSelection(filePath);

    switch(chosenFile['.tag']) {
        case 'file': {
            const chosenAction = await promptFileAction(chosenFile);
            switch(chosenAction) {
                case 'info': return handleInfo(chosenFile);
                case 'download': return 'download and exit';
                case 'cancel': return handleReturn(chosenFile);
                default: {
                  console.error('wtf?', chosenAction);
                  process.exit(1);
                }
            }
        };
            break;
        case 'folder': browseFolder(chosenFile.path_lower);
            break;
        case 'back': handleReturn(chosenFile);
            break;
        case 'exit': {
            console.error('bye.');
            process.exit(0);
        }
            break;
        default: {
            console.error('wtf?', chosenFile['.tag']);
            process.exit(1);
        }
    }
}