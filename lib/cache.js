const dbxRequest = require('../http');

let cache = {};

// todo save files and folders seperately in cache maybe?
// only cos i assume concating 2 arrays later is cheaper than looping and doing a filter...

exports.setCache = async function setCache (cwd = '', forceUpdate = false) {
  cache.cwd = cwd;
  if(!cache[cwd] || forceUpdate) {
    cache[cwd] = {};
    const documents = await dbxRequest.list(cwd);
    const files = [];
    const folders = [];
    for(let doc of documents) {
      const formatted = formatDoc(doc);
      if (formatted.type === 'folder') folders.push(formatted);
      if (formatted.type === 'file') files.push(formatted);
    }
    cache[cwd].files = files;
    cache[cwd].folders = folders;
  }
  return;
}

exports.getCache = function getCache () {
  return cache
}

function formatDoc (doc) {
  if(doc['.tag'] === 'file') {
    return {
      title: doc.name,
      value: { ...doc, evt: 'INFO' },
      type: 'file',
    };
  }
  if(doc['.tag'] === 'folder') {
    return {
      title: doc.name + '/',
      value: { ...doc, evt: 'CHANGE_DIR' },
      type: 'folder',
    };
  }
  // if neither file or folder, what happened??
  return {
    type: ''
  };
}
