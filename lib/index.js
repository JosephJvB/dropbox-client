const token = require('./token');
module.exports = {
    connect: require('./connect'),
    promptSetToken: token.promptSetToken,
    deleteToken: token.deleteToken,
    checkTokenExists: token.checkTokenExists,
};