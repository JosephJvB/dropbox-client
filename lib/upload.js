const axios = require('axios');
const fs = require('fs');
const url = require('url');
const prompts = require('prompts');

const api = require('../api.json');
const env = require('../env.json');
const Authorization = `Bearer ${env.app_token}`;

module.exports = async function handleUpload (fileString, saveAsName) {
    if(!fileString) {
        throw new Error('No filepath / url given to upload');
    }

    const pathArr = fileString.split('/');
    
    let fileName = pathArr[pathArr.length - 1];
    if(saveAsName) {
        fileName = saveAsName;
    } else {
        const renamePrompt = await prompts({
            type: 'confirm',
            name: 'yes',
            message: `Rename file ${fileName}? [y/n]`
        });
        if(renamePrompt.yes) {
            const renameChoice = await prompts({
                type: 'text',
                name: 'fileName',
                message: 'Enter new fileName:'
            });
            fileName = renameChoice.fileName;
        }
    }

    // assume if fileString starts with '[string]:// it is url
    const isUrl = !!url.parse(fileString).protocol;
    const uploadFn = isUrl ? uploadRemoteFile : uploadLocalFile;
  
    console.log(`
        Uploading ${fileString}
        Saving ${fileName} to dropbox
    `);

    return uploadFn(fileString, fileName);
}

function uploadLocalFile (localFile, filePath) {
    return axios(api.upload, {
        method: 'POST',
        data: fs.createReadStream(localFile),
        headers: {
            Authorization,
            'Content-Type': 'application/octet-stream',
            'Dropbox-Api-Arg': JSON.stringify({
                path: `/${filePath}`,
                mode: 'add'
            })
        }
    });
}


// Save the data from a specified URL into a file in user's Dropbox.
// Note that the transfer from the URL must complete within 5 minutes, or the operation will time out and the job will fail.
function uploadRemoteFile (url, filePath) {
    return axios(api.upload_remote, {
        method: 'POST',
        headers : {
            Authorization,
            'Content-Type': 'application/json',
        },
        data: {
            url,
            path: `/${filePath}`
        }
    });
}