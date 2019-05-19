const dbxRequest = require('../http');

module.exports = async function info (file) {
  const info = await dbxRequest.info(file.id);

  console.log(info);

  this.emit('AWAIT_CMD');
}