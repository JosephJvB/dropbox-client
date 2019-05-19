const dbxRequest = require('../http');

let cache = {};

exports.setCache = async function setCache (folder = {}, forceUpdate = false) {
  const path = folder.cwd || '';
  if(!cache[path] || forceUpdate) {
    cache[path] = await dbxRequest.list(path);
  }
  cache.cwd = path;
  return;
}

exports.getCache = function getCache () {
  return cache
}
