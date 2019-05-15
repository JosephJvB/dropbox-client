#! /usr/bin/env node
const fs = require('fs');
const path = require('path');
const prompts = require('prompts');

const lib = require('./lib');
const envPath = path.join(__dirname, 'env.json');

// make async to await token prompt
(async function init() {
    const envFileExists = fs.existsSync(envPath);
    const tokenIsSet = () => {
        return !!JSON.parse(
            fs.readFileSync(envPath)
        ).app_token;
    }    
    // set token if not exists
    if(!envFileExists || !tokenIsSet()) {
        await promptSetToken();
    }
    
    const helpText = `
        Usage:
        dbx [action] [options]
    
        Actions:
        get-contents: [gc]
            dbx get-contents [path/id]
    
        get-meta: [gm]
            dbx get-meta [path/id]
            -- cannot get meta-data at root path --
    
        upload: [u, up]
            dbx u [local-file-path/url] --as new-db-file.txt
    
        download: [d, dl, down]
            dbx D [file-path/id]  --as new-local-file.txt
    
        nb: --as flags are optional
    `;

    const inputArgs = process.argv.slice(2);
    const [action, identifier] = inputArgs;
    const asIdx = inputArgs.findIndex(a => a === '--as');
    const as = asIdx > 0 ? inputArgs[asIdx + 1] : null;
    
    if(!action) {
        return console.log(helpText);
    }
    
    switch(action.toLowerCase()) {
        case 'gm':
        case 'get-meta': log(lib.getMetaData(identifier));
            break;
        case 'gc':
        case 'get-contents': log(lib.getFolderContents(identifier));
            break;
        case 'u':
        case 'up':
        case 'upload': log(lib.handleUpload(identifier, as));
            break;
        case 'd':
        case 'dl':
        case 'down':
        case 'download': log(lib.handleDownload(identifier, as));
            break;
        case 'auth': setTokenPrompt()
            break;
        default: console.log(helpText)
    }
})();


function log (p) {
    p.then(r => console.log(JSON.stringify(r.data, null, 2)))
    .catch(console.error);
}

async function promptSetToken () {
    const response = await prompts({
        type: 'text',
        name: 'token',
        message: 'No Authentication token set\nEnter Dropbox Authentication token:\n'
    })

    // call replace in case user enters token WITH "Bearer "
    // I only want the hash, I add "Bearer " at request time
    // eg: ./lib/get-info line 5
    // good or bad this way?? No idea but it's what im doing
    const envJson = JSON.stringify({
        app_token: response.token.replace('Bearer ', '')
    },null,2);
    fs.writeFileSync(envPath, envJson);
    return;
}