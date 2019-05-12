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

function getFileMetaByName (filePath) {
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
function downloadFile (pathOrId, dlAsFileName) {
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
      const downloadPath = getDownloadFilePath(dlAsFileName, headers);
      fs.writeFileSync(downloadPath, data);
  
      console.log('Saved file:', downloadPath);
      return downloadPath;
  });
}

// https://futurestud.io/tutorials/download-files-images-with-axios-in-node-js
function downloadImage (pathOrId, dlAsFileName) {
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
    // return promise to be resolved on writestream finish.
    return new Promise((resolve, reject) => {
      const downloadPath = getDownloadFilePath(dlAsFileName, headers);
      const writer = fs.createWriteStream(downloadPath);
  
      writer.on('error', reject);
      writer.on('finish', () => {
        console.log('Saved image:', downloadPath);
        resolve(downloadPath);
      });
  
      // begin!!
      data.pipe(writer);
    });
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
// downloadFile('/haha-nice.txt.txt')
// downloadImage('/remooote.png', 'new-name.png')
//UNTESTED


function log (p) {
  p.then(r => console.log(r.data))
  .catch(e => console.error(e));
}

// Save downloaded file as name that user inputs
// if user inputs no name, save as filename from dropbox
function getDownloadFilePath (inputName, headers) {
  const fileName = inputName || (function () {
    const headersJson = JSON.parse(headers['dropbox-api-result']);
    const headerArr = headersJson.path_display.split('/');
    return headerArr[headerArr.length - 1];
  }());
  const downloadPath = path.join(os.homedir(), 'Downloads', fileName);
  return downloadPath;
}
