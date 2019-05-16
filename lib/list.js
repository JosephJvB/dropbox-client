const axios = require('axios');

const api = require('../api.json');
const env = require('../env.json');
const Authorization = `Bearer ${env.app_token}`;

// can list folder contents by folderPath or by folderID
module.exports = async function listContents (identifier, verbose) {
  const contents = await axios(api.folder_contents, {
      method: 'POST',
      headers: {
          Authorization,
          'Content-Type': 'application/json'
      },
      data: { path: identifier || '' }
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
