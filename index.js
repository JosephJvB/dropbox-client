#! /usr/bin/env node
const fs = require('fs');
const path = require('path');

const lib = require('./lib');

const envPath = path.join(__dirname, 'test.env.json');

function setTokenPrompt () {
    console.log('please enter your authToken');
    const token = "token";

    const envJson = JSON.stringify({app_token: token}, null, 2);
    fs.writeFileSync(envPath, envJson);
    return;
}

// set token if not exists
if(fs.existsSync(envPath)) {
    const env = fs.readFileSync(envPath);
    if(!env.app_token) {
        setTokenPrompt();
    }
} else {
    setTokenPrompt();
}

const helpText = `
    Usage
    dbx [action] [options]

    [Get]
    dbx gc [path/id]  get folder contents
    dbx gm [path/id]  get file/folder meta-data

    -- cannot get meta-data at root path --


    [Upload]
    dbx ul ./file.txt --as new-db-file.txt  upload local
    dbx ur https://file.txt --as new-db-file.txt  upload remote


    [Download]
    dbx D [file-path/id]  --as new-local-file.txt  download

    nb: --as flags are optional
`;
const inputArgs = process.argv.slice(2);

const [action, identifier] = inputArgs;
const asIdx = inputArgs.findIndex(a => a === '--as');
const as = asIdx > 0 ? inputArgs[asIdx + 1] : null;

if(!action) {
    return console.log(helpText)
}

switch(action.toLowerCase()) {
    case 'get-meta':
    case 'gm': log(lib.getMetaData(identifier));
        break;
    case 'get-contents':
    case 'gc': log(lib.getFolderContents(identifier));
        break;
    case 'up':
    case 'up-l':
    case 'ul': log(lib.uploadLocalFile(identifier, as));
        break;
    case 'up-r':
    case 'up-url':
    case 'ur': log(lib.uploadRemoteFile(identifier, as));
        break;
    case 'd':
    case 'dl': log(lib.handleDownload(identifier, as));
        break;
    case 'auth': setTokenPrompt()
        break;
    default: console.log(helpText)
}

function log (p) {
    p.then(r => console.log(JSON.stringify(r.data, null, 2)))
    .catch(console.error);
}
