const axios = require('axios');
const fs = require('fs');
const url = require('url');

const api = require('../api.json');
const env = require('../env.json');
const Authorization = `Bearer ${env.app_token}`;

module.exports = function handleUpload (fileString, saveAsName) {
    const pathArr = fileString.split('/');
    const dropboxFileName = saveAsName || pathArr[pathArr.length - 1];
    
    // assume if fileString starts with '[string]:// it is url
    const isUrl = !!url.parse(fileString).protocol;
    const uploadFn = isUrl ? uploadRemoteFile : uploadLocalFile;
  
    return uploadFn(fileString, dropboxFileName);
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