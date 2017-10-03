const db = require('dropbox-stream');
const AWS = require('aws-sdk');
const fs = require('fs');
const path = require('path');
const request = require('request');
PassThroughStream = require('stream').PassThrough;

const s3 = new AWS.S3();

const src = process.argv[2];
const dest = process.argv[3]

let up;

switch(dest){

  case 'dropbox':
	console.log('using Dropbox');
	const opts = {
    	token: "your-token-here",
    	  filepath: '/' + path.basename(src),
    	  chunkSize: 140 * 1000 * 1024, //  100 Mb
    	  autorename: true
  	};

	up  = db.createDropboxUploadStream(opts)
  		.on('done', res => console.log('Success', res))
  		.on('progress', res => console.log(res))
  		.on('error', err => console.log(err))
  break;

  case "s3":
	console.log('using S3');
	up = new PassThroughStream();
	const params = {Bucket: 'ps-content-development', Key: 'test/s3-upload/migon/'+path.basename(src), Body: up};
	const options = {partSize: 140 * 1024 * 1024, queueSize: 1};
	let upload = s3.upload(params, options, (err, res) => {
		console.log(res);
	});


  break;

}

let regexp = new RegExp('http(s):\/\/.+');

let s = (regexp.test(src)) ? request.get(src) : fs.createReadStream(src);

s.pipe(up);

