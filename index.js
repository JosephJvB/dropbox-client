const axios = require('axios');
const fs = require('fs');

const env = require('./env.json');
// endpoints from https://www.dropbox.com/developers/documentation/http/documentation
const api = require('./api.json');

const Authorization = `Bearer ${env.app_token}`;

function getFileMetaByName (filePath) {;
  return axios(api.file_meta, {
    method: 'POST',
    headers: {
      Authorization,
      'Content-Type': 'application/json'
    },
    data: {path: `/${filePath}`}
  });
}

function getFolderContents (folderPath) {
  return axios(api.folder_contents, {
    method: 'POST',
    headers: {
      Authorization,
      'Content-Type': 'application/json'
    },
    data: {
      path: folderPath
    }
  });
}

function uploadLocalFile (localFile, filePath) {
  return axios(api.upload, {
    method: 'POST',
    data: fs.createReadStream(localFile),
    headers: {
      Authorization,
      'Content-Type': 'application/octet-stream',
      'Dropbox-Api-Arg': JSON.stringify({
        path: `/${filePath}`,
        mode: 'add'
      })
    }
  });
}


// Save the data from a specified URL into a file in user's Dropbox.
// Note that the transfer from the URL must complete within 5 minutes, or the operation will time out and the job will fail.
function uploadRemoteFile (url, filePath) {
  return axios(api.upload_remote, {
    method: 'POST',
    headers : {
      Authorization,
      'Content-Type': 'application/json',
    },
    data: {
      url,
      path: `/${filePath}`
    }
  });
}

//TESTED
// log(getFileMetaByName('remooote.png'));
// log(getFolderContents(''));
// log(uploadLocalFile('./test.txt', 'haha-nice.txt'));
// log(uploadRemoteFile(
//   'https://www.mixdownmag.com.au/sites/default/files/styles/flexslider_h400/public/images/Stu Main.jpg',
//   'stewart.jpg'
// ));
//UNTESTED

function log (p) {
  p.then(r => console.log(r.data))
  .catch(e => console.error(e));
}