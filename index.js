const axios = require('axios');
const fs = require('fs');

const env = require('./env.json')
// endpoints from https://www.dropbox.com/developers/documentation/http/documentation
const api = require('./api.json')

const _opts = {
  method: 'post',
  headers: {
    'Authorization': `Bearer ${env.app_token}`,
    'Content-Type': 'application/json',
  },
  data: JSON.stringify({
    path: ''
  })
};

function getFileMetaByName (name) {
  const opts = {..._opts, 
    data: JSON.stringify({path: `/${name}`})
  };
  return axios(api.file_meta, opts);
}

function getFolderContents () {
  const opts = {..._opts};
  return axios(api.folder_contents, opts);
}

function uploadLocalFile (localFile, fileName) {
  const ext = localFile.split('.').pop();
  const opts = {..._opts,
    data: fs.createReadStream(localFile),
    headers: {..._opts.headers,
      'Dropbox-Api-Arg': JSON.stringify({
        path: `/${fileName}.${ext}`,
        mode: 'add'
      }),
      'Content-Type': 'application/octet-stream'
    },
  };
  return axios(api.upload, opts);
}

function uploadRemoteFile () {
  const x = 'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/240/apple/198/books_1f4da.png';
  const opts = {..._opts,
    // error here: cant send remote image as stream yet..
    data: axios(x),
    headers : {..._opts.headers,
      'Dropbox-Api-Arg': JSON.stringify({
        path: '/remosste.png',
        mode: 'add'
      }),
      'Content-Type': 'application/octet-stream',
    }
  };
  return axios(api.upload, opts);
}

// log(getFileMetaByName('test.txt'))
// log(getFolderContents())
const testPath = __dirname + '/test.txt'
// log(uploadFile(testPath, 'yeeeeet'));
log(uploadRemoteFile());

function log (p) {
  p.then(r => console.log(r.data))
  .catch(e => console.error(e));
}