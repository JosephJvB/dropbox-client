const dbxRequest = require('../http');

let cache = {};

exports.setCache = async function setCache (cwd = '', forceUpdate = false) {
  cache.cwd = cwd;
  if(!cache[cwd] || forceUpdate) {
    cache[cwd] = {};
    const documents = await dbxRequest.list(cwd);
    const { files, folders } = splitDocuments(documents);
    cache[cwd].files = files;
    cache[cwd].folders = folders;
  }
  return;
}

exports.getCache = function getCache () {
  return cache
}

function splitDocuments (docs) {
  const files = [];
  const folders = [];
  // loop
  for(let doc of docs) {
    // reformat files
    if (doc['.tag'] === 'file') files.push({
      title: doc.name,
      value: { ...doc, evt: 'FILE_SELECT' },
      type: 'file',
    });
    // reformat folders
    if (doc['.tag'] === 'folder') folders.push({
      title: doc.name + '/',
      value: { ...doc, evt: 'CHANGE_DIR' },
      type: 'folder',
    });
  }
  return { files, folders };
}
