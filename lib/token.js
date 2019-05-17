const fs = require('fs');
const path = require('path');
const util = require('util');
const prompts = require('prompts');

const envPath = path.join(__dirname, 'env.json');

exports.deleteToken = function deleteToken () {
  return util.promisify(fs.unlink)(envPath);
}

exports.checkTokenExists = async function checkTokenExists () {
  const envFileExists = fs.existsSync(envPath);
  const tokenIsSet = () => {
    return !!JSON.parse(
        fs.readFileSync(envPath)
    ).app_token;
  }    

  if(envFileExists && tokenIsSet()) {
    return true
  } else {
    return false
  }
}

exports.promptSetToken = async function promptSetToken ({required}) {
  const response = await prompts({
    type: 'text',
    name: 'token',
    message: `${required ? 'No app token set\n' : ''}Enter Dropbox app token:\n`
  }, {
    onCancel: () => {
      if(required) {
        const url = 'https://www.dropbox.com/developers/apps';
        console.log(`Must set app-token to proceed\nVisit ${url} to generate a token`);
      }
      console.log('bye.');
      process.exit(0);
    }
  });

  // call replace in case user enters token WITH "Bearer "
  // I only want the hash, I add "Bearer " at request time
  // eg: ./lib/get-info line 5
  // good or bad this way?? No idea but it's what im doing
  const envJson = JSON.stringify({
      app_token: response.token.replace('Bearer ', '')
  },null,2);
  fs.writeFileSync(envPath, envJson);
 
  console.log('Token set: success, exiting...')
  process.exit(0);
}