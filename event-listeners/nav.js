exports.back = function back (evt) {
  if(evt.cwd) {
    this.emit('SET_CACHE', {cwd: getPrevDir(evt.cwd)});
  } else {
    this.emit('SET_CACHE', {cwd: ''});
  }
}
exports.home = function home () {
  this.emit('SET_CACHE', {cwd: ''});
}

function getPrevDir (file) {
  const currentPathArr = file.path_lower.split('/');
  return currentPathArr.slice(0, currentPathArr.length - 1).join('/');
} 