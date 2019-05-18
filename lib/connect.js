const req = require('../http');
const {
    promptFileAction,
    promptFileSelection
} = require('./prompt-util');

module.exports = connectToFolder;

const getPrevDir = (file) => {
    const currentPathArr = file.path_lower.split('/');
    return currentPathArr.slice(0, currentPathArr.length - 1).join('/');    
}
const handleInfo = async (file) => {
    await req.info(file.id)
    return connectToFolder(getPrevDir(file), true);
}
const handleReturn = async (file) => {
    return connectToFolder(getPrevDir(file));
}
const handleDownload = async (file) => {
    await req.download(file.path_lower);
    return connectToFolder(getPrevDir(file), true);
}

async function connectToFolder (filePath = '', preserveLogs = false) {
    const chosenFile = await promptFileSelection(filePath, preserveLogs);

    switch(chosenFile['.tag']) {
        case 'file': {
            const chosenAction = await promptFileAction(chosenFile);
            switch(chosenAction) {
                case 'info': handleInfo(chosenFile);
                    break;
                case 'download': handleDownload(chosenFile);
                    break;
                case 'cancel': handleReturn(chosenFile);
                    break;
                case 'exit': {
                    console.error('bye.');
                    process.exit(0);
                };
                    break;
                default: {
                  console.error('wtf?', chosenAction);
                  process.exit(1);
                }
            };
        };
            break;
        case 'folder': connectToFolder(chosenFile.path_lower);
            break;
        case 'back': handleReturn(chosenFile);
            break;
        case 'exit': {
            console.error('bye.');
            process.exit(0);
        };
            break;
        default: {
            console.error('wtf?', chosenFile['.tag']);
            process.exit(1);
        };
    };
}