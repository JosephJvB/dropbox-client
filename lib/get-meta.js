const axios = require('axios');

const api = require('../api.json');
const env = require('../env.json');
const Authorization = `Bearer ${env.app_token}`;

module.exports = async function getMetaData (metaPath) {
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
