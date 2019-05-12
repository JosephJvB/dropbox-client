const axios = require('axios');
const fs = require('fs');
const os = require('os');
const path = require('path');

const env = require('./env.json');
// endpoints from https://www.dropbox.com/developers/documentation/http/documentation
const api = require('./api.json');

const Authorization = `Bearer ${env.app_token}`;

module.exports = {
  getMetaData,
  getFolderContents,
  uploadLocalFile,
  uploadRemoteFile,
  handleDownload
};

// can ask for a single file or a folder
// cant ask for root-folder (App) meta-data
function getMetaData (metaPath) {
  return axios(api.file_meta, {
    method: 'POST',
    headers: {
      Authorization,
      'Content-Type': 'application/json'
    },
    data: {path: metaPath}
  })
}

function getFolderContents (folderPath) {
  return axios(api.folder_contents, {
    method: 'POST',
    headers: {
      Authorization,
      'Content-Type': 'application/json'
    },
    data: {
      path: folderPath || ''
    }
  })
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
  })
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
function downloadFile (docId, downloadPath) {
  return axios(api.download, {
    method: 'POST',
    headers: {
      Authorization,
      'Content-Type': 'application/octet-stream',
      'Dropbox-API-Arg': JSON.stringify({
        path: docId,
      })
    }
  })
  .then(res => {
      fs.writeFileSync(downloadPath, res.data);
  
      return res;
  });
}

// https://futurestud.io/tutorials/download-files-images-with-axios-in-node-js
function downloadImage (docId, downloadPath) {
  return axios(api.download, {
    method: 'POST',
    responseType: 'stream',
    headers: {
      Authorization,
      'Content-Type': 'application/octet-stream',
      'Dropbox-API-Arg': JSON.stringify({
        path: docId,
      })
    }
  })
  .then(res => {
    // return promise to be resolved on writestream finish.
    return new Promise((resolve, reject) => {
      const writer = fs.createWriteStream(downloadPath);
  
      writer.on('error', reject);
      writer.on('finish', () => {
        resolve(res);
      });
  
      // begin!!
      res.data.pipe(writer);
    });
  });
}

// fileId can be dropbox ID or dropbox filepath
function handleDownload (fileId, saveAsName) {
  // find req download file meta data before attempting to DL
  return getMetaData(fileId)
  .then(res => {
    const downloadPath = path.join(
      os.homedir(),
      'Downloads',
      saveAsName || res.data.name
    );

    const imageExts = ['jpg', 'jpeg', 'png', 'svg', 'gif', 'webP'];
    const ext = downloadPath.split('.').pop();

    const downloadFn = imageExts.includes(ext)
      ? downloadImage
      : downloadFile
      
    return downloadFn(res.data.id, downloadPath)
    .then(() => ({
      data: {
        id: res.data.id,
        name: saveAsName || res.data.name,
        full_path: downloadPath,
      }
    }))
    .catch(e => {
      console.error('error getting file to download');
      throw new Error(e);
    })
  })
  .catch(e => {
    console.error('Failed to get file to download', fileId);
  })
}
