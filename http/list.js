const axios = require('axios');

const api = require('../api.json');

// can list folder contents by folderPath or by folderID
module.exports = async function listContents (identifier = '') {
  const contents = await axios(api.folder_contents, {
      method: 'POST',
      headers: {
          Authorization: process.env.APP_TOKEN,
          'Content-Type': 'application/json'
      },
      data: { path: identifier }
  });

  return contents.data.entries
  
}
