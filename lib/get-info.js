const axios = require('axios');

const api = require('../api.json');
const env = require('../env.json');
const Authorization = `Bearer ${env.app_token}`;

exports.getMetaData = async function getMetaData (metaPath) {
    if(!metaPath) {
        throw new Error('No filepath given. Cannot return meta data for root');
    }
    return axios(api.file_meta, {
        method: 'POST',
        headers: {
        Authorization,
        'Content-Type': 'application/json'
        },
        data: { path: metaPath }
    });
}

exports.getFolderContents = async function getFolderContents (folderPath, verbose) {
    const contents = await axios(api.folder_contents, {
        method: 'POST',
        headers: {
            Authorization,
            'Content-Type': 'application/json'
        },
        data: { path: folderPath || '' }
    });

    // make content more readable by default
    // not verbose unless specified
    const output = verbose
    ? contents.data.entries
    : contents.data.entries.map(doc => ({
        type: doc['.tag'],
        name: doc.name,
    }));
    return { data: output };
}
