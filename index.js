const db = require('dropbox-stream');
const fs = require('fs');
const path = require('path');
const request = require('request');

const src = process.argv[2];
const opts = {
    token: "your-token-here",
    filepath: '/' + path.basename(src),
    chunkSize: 140 * 1000 * 1024, //  100 Mb
    autorename: true
  };

let up = db.createDropboxUploadStream(opts)
  .on('done', res => console.log('Success', res))
  .on('progress', res => console.log(res))
  .on('error', err => console.log(err))

let regexp = new RegExp('http(s):\/\/.+');

let stream = (regexp.test(src)) ? request.get(src) : fs.createReadStream(src).pipe(up);

stream.pipe(up);
