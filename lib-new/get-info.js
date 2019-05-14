const axios = require('axios');

const api = require('../api.json');
const env = require('../env.json');
const Authorization = `Bearer ${env.app_token}`;

exports.getMetaData = function getMetaData (metaPath) {
    return axios(api.file_meta, {
        method: 'POST',
        headers: {
        Authorization,
        'Content-Type': 'application/json'
        },
        data: { path: metaPath }
    })
}

exports.getFolderContents = function getFolderContents (folderPath) {
    return axios(api.folder_contents, {
        method: 'POST',
        headers: {
            Authorization,
            'Content-Type': 'application/json'
        },
        data: { path: folderPath || '' }
    })
}
