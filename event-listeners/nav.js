const { setCache, getCache } = require('../lib/cache');

exports.changeDir = async function changeDir (file) {
  await setCache(file.value.path_lower);
  this.emit('CLEAR_SCREEN');
  return;
}
exports.back = async function back (file) {
  if(file.value.path_lower) {
    await setCache(getPrevDir(file.value.path_lower));
  } else {
    await setCache('');
  }
  this.emit('CLEAR_SCREEN');
  return;
}
exports.home = async function home () {
  await setCache('');
  this.emit('CLEAR_SCREEN');
  return;
}

function getPrevDir (path) {
  const currentPathArr = path.split('/');
  return currentPathArr.slice(0, currentPathArr.length - 1).join('/');
} 