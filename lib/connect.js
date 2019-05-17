const writeInfo = require('./info');
const {
    promptFileAction,
    promptFileSelection
} = require('./prompt-util');

module.exports = browseFolder;

const handleInfo = async (file) => {
    const currentPathArr = file.path_lower.split('/');
    const prevDir = currentPathArr.slice(0, currentPathArr.length - 1).join('/');
    await writeInfo(file.id)
    return browseFolder(prevDir, true);
}

const handleReturn = async (file) => {
    const currentPathArr = file.path_lower.split('/');
    const prevDir = currentPathArr.slice(0, currentPathArr.length - 1).join('/');
    return browseFolder(prevDir);
}

async function browseFolder (filePath = '', preserveLogs = false) {
    const chosenFile = await promptFileSelection(filePath, preserveLogs);

    switch(chosenFile['.tag']) {
        case 'file': {
            const chosenAction = await promptFileAction(chosenFile);
            switch(chosenAction) {
                case 'info': handleInfo(chosenFile);
                    break;
                case 'download': 'download and exit';
                    break;
                case 'cancel': handleReturn(chosenFile);
                    break;
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