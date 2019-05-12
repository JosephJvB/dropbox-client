const meow = require('meow');

const lib = require('./lib')

const cli = meow(`
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
`, {
    flags: {
        help: {
            type: 'boolean',
            alias: 'h'
        },
        as: {
            type: 'string',
            default: null
        }
    }
});

const [action, identifier] = cli.input;
const as = cli.flags.as;
if(!action) {
    return cli.showHelp(0); // exit on error code 0 (swallow)
}

const doAction = () => {
    switch(action.toLowerCase()) {
        case 'gm': log(lib.getMetaData(identifier));
            break;
        case 'gc': log(lib.getFolderContents(identifier));
            break;
        case 'ul': log(lib.uploadLocalFile(identifier, as));
            break;
        case 'gr': log(lib.uploadRemoteFile(identifier, as));
            break;
        case 'd':
        case 'dl': log(lib.handleDownload(identifier, as));
            break;
        default: cli.showHelp(0);
    }
}

function log (p) {
    p.then(r => console.log(JSON.stringify(r.data, null, 2)))
    .catch(console.error);
}

doAction();