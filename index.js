#! /usr/bin/env node
const fs = require('fs');
const path = require('path');
const util = require('util');
const prompts = require('prompts');

const lib = require('./lib');

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

        dbx upload <local-file-path/url> [--as new-db-file.txt]

        dbx token:set
        dbx token:destroy
    `;

    // flags start with '-', everything else a command
    const cmds = [];
    const flags = [];
    for(arg of process.argv.slice(2)) {
        arg[0] === '-'
        ? flags.push(arg)
        : cmds.push(arg)
    }
    const [action, fileIdentifier] = cmds;
    const asIdx = flags.findIndex(a => a === '--as');
    const saveAsName = asIdx > 0 ? inputArgs[asIdx + 1] : null;
    const helpArgs = ['-h', 'elp'];
    const help = flags.find(a => helpArgs.includes(a.toLowerCase())); 

    if(!action || help) {
        return console.log(helpText);
    }
 
    try {
        switch(action.toLowerCase()) {
            case 'connect': lib.connect();
                break;
            case 'token:set': lib.promptSetToken({required:false});
                break;
            case 'token:destroy': lib.deleteToken();
                break;
            case 'error': logError();
                break;
            default: console.log(helpText);
        }
    } catch (e) {
        // if axios error
        if('response' in e) {
            // found this error shape once...
            // and as much as I like logging [object Object], I dont.
            const data = 'error_summary' in e.response.data
            ? e.response.data.error_summary
            : e.response.data;
            console.error(
                `\n[status] ${e.response.status}\n[data] ${data}`
            );
        } else {
            console.error(e)
            console.error('Error:', e.message);
            console.error('\n   dbx --help to see usage');
        }

        console.log('exiting...')
        process.exit(1);
    }
})();

// sick friday arvo memes with the boyes
function logError () {
    const opts = [
        'Uncaught TypeError: Cannot read property "value" of undefined',
        'VLAUE = [object Object]',
        'Uncaught TypeError: undefined is not a function',
        'CORS error: Cannot load https://www.youtube.com/watch?v=dQw4w9WgXcQ. No "Access-Control-Allow-Origin" header is present on the requested resource.',
        'TypeError: Cannot read property ‘length’ of undefined',
        '---GOT THIS FAR---',
        'hello?',
        'I was called'
    ];
    console.error(opts[Math.floor(Math.random() * opts.length)]);
    console.log('exiting...');
    process.exit(1);
}