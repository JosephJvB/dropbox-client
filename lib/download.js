const axios = require('axios');
const path = require('path');
const fs = require('fs');
const os = require('os');

const { getMetaData } = require('./get-info');
const api = require('../api.json');
const env = require('../env.json');
const Authorization = `Bearer ${env.app_token}`;

module.exports = async function handleDownload (fileId, saveAsName) {
    try {
        // find req download file meta data before attempting to DL
        // get by ID or by path
        const metaResult = await getMetaData(fileId)
    
        const downloadPath = path.join(
            os.homedir(),
            'Downloads',
            saveAsName || metaResult.data.name
        );
    
        const imageExts = ['jpg', 'jpeg', 'png', 'svg', 'gif', 'webP'];
        const ext = downloadPath.split('.').pop();
    
        const downloadFn = imageExts.includes(ext)
        ? downloadImage
        : downloadFile;
            
        await downloadFn(metaResult.data.id, downloadPath)
    
        return {
            data: {
                id: metaResult.data.id,
                name: saveAsName || metaResult.data.name,
                full_path: downloadPath,
            }
        };
    } catch (e) {
        // assumes axios format error:
        if('response' in e) {
            throw new Error(
                `\n[status] ${e.response.status}\n[data]\n${e.response.data}`
            );
        } else {
            // writefile error or something else
            throw new Error(e);
        }
    }
}

// joe: struggle to find one download/writefile method that would work for both image and txt files. Split into two.
// havent tried other file exts yet...

async function downloadFile (docId, downloadPath) {
    const downloadResult = await axios(api.download, {
      method: 'POST',
      headers: {
        Authorization,
        'Content-Type': 'application/octet-stream',
        'Dropbox-API-Arg': JSON.stringify({
          path: docId,
        })
      }
    })
    fs.writeFileSync(downloadPath, downloadResult.data);
        
    return downloadResult;
  }
  
// https://futurestud.io/tutorials/download-files-images-with-axios-in-node-js
async function downloadImage (docId, downloadPath) {
    const downloadResult = await axios(api.download, {
        method: 'POST',
        responseType: 'stream',
        headers: {
            Authorization,
            'Content-Type': 'application/octet-stream',
            'Dropbox-API-Arg': JSON.stringify({
                path: docId,
            })
        }
    });
    // return promise to be resolved on writestream finish.
    // I made this function async and now it's kinda strange to explicitly return a promise from inside an async fn...lol
    return new Promise((resolve, reject) => {
        const writer = fs.createWriteStream(downloadPath);

        writer.on('error', reject);
        writer.on('finish', () => {
            resolve(downloadResult);
        });

        // begin!!
        downloadResult.data.pipe(writer);
    });
}
