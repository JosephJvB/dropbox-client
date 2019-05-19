const dbxRequest = require('./http');

module.exports = function info () {
  dbxRequest.info(file.id);

  this.emit('AWAIT_TEXT');
}