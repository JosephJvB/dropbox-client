#! /usr/bin/env node
const fs = require('fs');
const path = require('path');
const prompts = require('prompts');

// hack to avoid loading ./lib before env.json exists, else error
// see line above switch statement
const loadLib = () => require('./lib');
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
        key: <> = required, [] = optional

        Usage:
        dbx [action] [options]
    
        Actions:
        list-contents: list, l
            dbx list [path/id]
    
        meta: m
            dbx meta <path/id>
            -- cannot get meta-data at root path --
    
        upload: u, up
            dbx u <local-file-path/url> [--as new-db-file.txt]
    
        download: d, dl, down
            dbx download
            -- follow prompts to download --
    `;

    const cmds = [];
    const flags = [];
    for(arg of process.argv.slice(2)) {
        arg[0] === '-'
        ? flags.push(arg)
        : cmds.push(arg)
    }
    const [action, identifier] = cmds;
    // flags
    const asIdx = flags.findIndex(a => a === '--as');
    const saveAsName = asIdx > 0 ? inputArgs[asIdx + 1] : null;
    const helpArgs = ['-h', 'help'];
    const help = flags.find(a => helpArgs.includes(a.toLowerCase())); 
    const verboseArgs = ['-v', '--verbose'];
    const verbose = flags.find(a => verboseArgs.includes(a.toLowerCase()));

    if(!action || help) {
        return console.log(helpText);
    }
 
    // hack here
    const lib = loadLib();
    switch(action.toLowerCase()) {
        case 'm':
        case 'meta': log(lib.getMetaData(identifier));
            break;
        case 'l':
        case 'list':
        case 'list-contents': log(lib.listContents(identifier, verbose));
            break;
        case 'u':
        case 'up':
        case 'upload': log(lib.handleUpload(identifier, saveAsName));
            break;
        case 'd':
        case 'dl':
        case 'down':
        case 'download': log(lib.handleDownload());
            break;
        case 'auth': setTokenPrompt();
            break;
        default: console.log(helpText);
    }
})();


function log (p) {
    p.then(r => {
        console.log(JSON.stringify(r.data, null, 2));
    })
    .catch(e => {
        console.error('Error:', e.message);
        console.error('\n   dbx --help to see usage');
        process.exit(1);
    });
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
