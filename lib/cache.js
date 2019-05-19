const dbxRequest = require('../http');

let cache = {};

exports.setCache = async function setCache (cwd = '', forceUpdate = false) {
  if(!cache[cwd] || forceUpdate) {
    const data = await dbxRequest.list(cwd);
    const formattedContents = data.map(doc => {
      return {
        title: `${doc.name}${doc['.tag'] === 'folder' ? '/' : ''}`,
        value: { ...doc, evt: '' },
        type: doc['.tag'],
      };
    })
    cache[cwd] = formattedContents;
  }
  cache.cwd = cwd;
  return;
}

exports.getCache = function getCache () {
  return cache
}
