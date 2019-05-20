const dbxRequest = require('../http');

let cache = {};

// have split files and folders
// only cos i assume concating 2 arrays later is cheaper than filter later..

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
    if (doc.type === 'file') files.push({
      title: doc.name,
      value: { ...doc, evt: 'INFO' },
      type: 'file',
    });
    // reformat folders
    if (doc.type === 'folder') folders.push({
      title: doc.name + '/',
      value: { ...doc, evt: 'CHANGE_DIR' },
      type: 'folder',
    });
  }
  return { files, folders };
}
