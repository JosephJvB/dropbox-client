const axios = require('axios');
const fs = require('fs');
const url = require('url');

const api = require('../api.json');

module.exports = async function handleUpload (fileString, saveAsName) {
        // assume if fileString starts with '[string]:// it is url
        const isUrl = !!url.parse(fileString).protocol;
        const uploadFn = isUrl ? uploadRemoteFile : uploadLocalFile;
        
        // if local upload, make sure file is uploaded with its extension
        const ext = fileString.split('.').pop();
        const uploadFileName = isUrl
        ? saveAsName
        : saveAsName.endsWith(ext)
            ? saveAsName
            : saveAsName + '.' + ext;

        console.log(`
        Uploading ${fileString}
        Saving ${uploadFileName} to dropbox
        `);
        
        const uploadResult = await uploadFn(fileString, uploadFileName);
        
        console.log('Upload successful ✔\n');
}
    
function uploadLocalFile (localFile, filePath) {
    return axios(api.upload, {
        method: 'POST',
        data: fs.createReadStream(localFile),
        headers: {
            Authorization: process.env.APP_TOKEN,
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
            Authorization: process.env.APP_TOKEN,
            'Content-Type': 'application/json',
        },
        data: {
            url,
            path: `/${filePath}`
        }
    });
}