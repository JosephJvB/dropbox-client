const axios = require('axios');
const path = require('path');
const fs = require('fs');
const os = require('os');
// const prompts = require('prompts');

const api = require('../api.json');
const env = require('../env.json');
const Authorization = `Bearer ${env.app_token}`;

module.exports = async function handleDownload (filePath = '') {
    try {
        const chosenFile = filePath.split('/').pop();
        // const renamePrompt = await prompts({
        //     type: 'confirm',
        //     name: 'yes',
        //     message: `Rename file ${chosenFile}? [y/n]`
        // }, {
        //     onCancel: () => { console.log('bye.'); process.exit(0) }
        // });

        // // if chosen.value['.tag'] == folder start 

        // // step 2: rename file?
        // let fileName = '';
        // if(renamePrompt.yes) {
        //     const renameChoice = await prompts({
        //         type: 'text',
        //         name: 'fileName',
        //         message: 'Enter new filename:'
        //     }, {
        //         onCancel: () => { console.log('bye.'); process.exit(0) }
        //     });
        //     fileName = renameChoice.fileName;
        // } else {
        //     fileName = chosenFile;
        // }

        const fileName = chosenFile;

        const downloadPath = path.join(
            os.homedir(),
            'Downloads',
            fileName
        );

        const imageExts = ['jpg', 'jpeg', 'png', 'svg', 'gif', 'webP'];
        const ext = downloadPath.split('.').pop();

        const downloadFn = imageExts.includes(ext)
        ? downloadImage
        : downloadFile;

        console.log(`
            Downloading ${chosenFile}
            Saving to ${downloadPath}
        `);
        // do download
        await downloadFn(filePath, downloadPath);

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
        Authorization,
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
