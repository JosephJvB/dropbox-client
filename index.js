#! /usr/bin/env node
const fs = require('fs');
const path = require('path');
const util = require('util');
const prompts = require('prompts');

// hack to avoid loading ./lib before env.json exists, else error
// see line above switch statement
const loadLib = () => require('./lib');
const {
    checkTokenExists,
    promptSetToken,
    deleteToken
} = require('./token');

// make async to await token prompt
(async function init() {

    if(!await checkTokenExists()) {
        // promptSetToken calls process.exit(0)
        await promptSetToken({required: true});
    }

    const helpText = `
        key: <> = required, [] = optional

        Usage:
        dbx <action> [options]
    
        dbx connect

        dbx token:set
        dbx token:destroy

        dbx upload <local-file-path/url> [--as new-db-file.txt]
    `;

    // flags start with '-', everything else a command
    const cmds = [];
    const flags = [];
    for(arg of process.argv.slice(2)) {
        arg[0] === '-'
        ? flags.push(arg)
        : cmds.push(arg)
    }
    const [action] = cmds;
    const helpArgs = ['-h', 'help'];
    const help = flags.find(a => helpArgs.includes(a.toLowerCase())); 

    if(!action || help) {
        return console.log(helpText);
    }
 
    // hack here
    const lib = loadLib();
    switch(action.toLowerCase()) {
        case 'connect': console.log('nice');
            break;
        case 'token:set': promptSetToken({required:false});
            break;
        case 'token:destroy': deleteToken();
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
