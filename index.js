#! /usr/bin/env node
const fs = require('fs');
const path = require('path');
const util = require('util');
const prompts = require('prompts');

// hack to avoid loading ./lib before env.json exists, else error
// see line above switch statement
const loadLib = () => require('./lib');
const envPath = path.join(__dirname, 'test-env.json');
const deleteEnv = () => util.promisify(fs.unlink)(envPath);

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
        await promptSetToken({required:true})
        process.exit(0);
    }
    
    const helpText = `
        key: <> = required, [] = optional

        Usage:
        dbx <action> [options]
    
        Actions:
        auth: auth:set, auth:delete
            dbx auth:set
            dbx auth:delete

        start-interactive: int, i
            dbx i [path]

        list-contents: list, ls
            dbx list [path/id]
    
        meta: no alias
            dbx meta <path/id>
            -- cannot get meta-data at root path --
    
        upload: up
            dbx up <local-file-path/url> [--as new-db-file.txt]
    
        download: down, dl
            dbx download
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
        case 'meta': log(lib.getMetaData(identifier));
            break;
        case 'ls':
        case 'list':
        case 'list-contents': log(lib.listContents(identifier, verbose));
            break;
        case 'up':
        case 'upload': log(lib.handleUpload(identifier, saveAsName));
            break;
        case 'dl':
        case 'down':
        case 'download': log(lib.handleDownload());
            break;
        case 'auth':
        case 'auth:set': promptSetToken({required:false});
            break;
        case 'auth:d':
        case 'auth:destroy':
        case 'auth:delete': deleteEnv();
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

async function promptSetToken ({required}) {
    const response = await prompts({
        type: 'text',
        name: 'token',
        message: `${required ? 'No Authorization token set\n' : ''}Enter Dropbox Authorization token:\n`
    }, {
        onCancel: () => {
            const url = 'https://www.dropbox.com/developers/apps?_tk=pilot_lp&_ad=topbar4&_camp=myapps';
            if(required) {
                console.log(`Must set token to proceed\nvisit ${url} to generate a token`);
            }
            process.exit(0);
        }
    });

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
