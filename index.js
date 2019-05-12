const axios = require('axios');
const fs = require('fs');
const os = require('os');
const path = require('path');

const env = require('./env.json');
// endpoints from https://www.dropbox.com/developers/documentation/http/documentation
const api = require('./api.json');

const Authorization = `Bearer ${env.app_token}`;

module.exports = {
  getFileMetaByName,
  getFolderContents,
  uploadLocalFile,
  uploadRemoteFile,
  downloadFile,
  downloadImage
};

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

// can download a file by path OR by ID
function downloadFile (pathOrId, saveName) {
  return axios(api.download, {
    method: 'POST',
    headers: {
      Authorization,
      'Content-Type': 'application/octet-stream',
      'Dropbox-API-Arg': JSON.stringify({
        path: pathOrId,
      })
    }
  })
  .then(({headers, data}) => {
    // if no saveName: parse headers and save as dropbox fileName
    const fileName = saveName || (getFileNameFromHeaders(headers));

    const downloadPath = path.join(os.homedir(), 'Downloads', fileName);
    fs.writeFileSync(downloadPath, data);

    console.log('Saved file:', downloadPath);
    return downloadPath;
  });
}

// https://futurestud.io/tutorials/download-files-images-with-axios-in-node-js
function downloadImage (pathOrId, saveName) {
  return axios(api.download, {
    method: 'POST',
    responseType: 'stream',
    headers: {
      Authorization,
      'Content-Type': 'application/octet-stream',
      'Dropbox-API-Arg': JSON.stringify({
        path: pathOrId,
      })
    }
  })
  .then(({data, headers}) => {
    const fileName = saveName || (getFileNameFromHeaders(headers));

    const downloadPath = path.join(os.homedir(), 'Downloads', fileName);
    const writer = fs.createWriteStream(downloadPath);
    writer.on('finish', () => console.log('Saved image:', downloadPath));
    writer.on('error', e => console.error('WriteStream Error:', e));

    data.pipe(writer);
    return downloadPath;
  });
}

//TESTED
// log(getFileMetaByName('haha-nice.txt.txt'));
// log(getFolderContents(''));
// log(uploadLocalFile('./test.txt', 'haha-nice.txt'));
// log(uploadRemoteFile(
//   'https://www.mixdownmag.com.au/sites/default/files/styles/flexslider_h400/public/images/Stu Main.jpg',
//   'stewart.jpg'
// ));
// downloadFile('/haha-nice.txt.txt');
// downloadImage('/remooote.png', 'new-name.png')
//UNTESTED


function log (p) {
  p.then(r => console.log(r.data))
  .catch(e => console.error(e));
}

function getFileNameFromHeaders (headers) {
  const headersJson = JSON.parse(headers['dropbox-api-result']);
  const headArr = headersJson.path_display.split('/');
  return headArr[headArr.length - 1];
}