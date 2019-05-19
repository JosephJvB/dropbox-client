const axios = require('axios');
const path = require('path');
const fs = require('fs');
const os = require('os');
// const prompts = require('prompts');

const api = require('../api.json');

module.exports = async function handleDownload (file) {
    try {
        const downloadPath = path.join(
            os.homedir(),
            'Downloads',
            file.name
        );

        const imageExts = ['jpg', 'jpeg', 'png', 'svg', 'gif', 'webP'];
        const ext = downloadPath.split('.').pop();

        const downloadFn = imageExts.includes(ext)
        ? downloadImage
        : downloadFile;

        console.log(`
            Downloading ${file.name}
            Saving to ${downloadPath}
        `);
        // do download
        await downloadFn(file.id, downloadPath);

        console.log('   Download successful ✔\n');
        return;
    } catch (e) {
        // assumes axios format error:
        if('response' in e) {
            // found this error shape
            const data = 'error_summary' in e.response.data
            ? e.response.data.error_summary
            : e.response.data;
            throw new Error(
                `\n[status] ${e.response.status}\n[data] ${data}`
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
        Authorization: process.env.APP_TOKEN,
        'Content-Type': 'application/octet-stream',
        'Dropbox-API-Arg': JSON.stringify({
          path: docId,
        })
      }
    });
    fs.writeFileSync(downloadPath, downloadResult.data);
        
    return downloadResult;
  }
  
// https://futurestud.io/tutorials/download-files-images-with-axios-in-node-js
async function downloadImage (docId, downloadPath) {
    const downloadResult = await axios(api.download, {
        method: 'POST',
        responseType: 'stream',
        headers: {
            Authorization: process.env.APP_TOKEN,
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
