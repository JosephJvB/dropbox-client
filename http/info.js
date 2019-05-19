const axios = require('axios');

const api = require('../api.json');

module.exports = async function writeInfo (metaPath) {
    if(!metaPath) {
        throw new Error('No filepath given. Cannot return meta data for root');
    }
    const result = await axios(api.file_meta, {
        method: 'POST',
        headers: {
        Authorization: process.env.APP_TOKEN,
        'Content-Type': 'application/json'
        },
        data: { path: metaPath }
    });
    return result.data;
}
