/*
This file holds all aws s3 upload routes.
*/

const aws = require('aws-sdk');
const request = require('request');
const express = require('express');
const uuidv1 = require('uuid/v1');
var router = express.Router();


/*
  set envirnoment variables: ACCESS_KEY_ID, SECRET_ACCESS_KEY
*/

const S3_BUCKET         = "upload.media.futureboard.olin.build";
const ACCESS_KEY_ID     = process.env.ACCESS_KEY_ID;
const SECRET_ACCESS_KEY = process.env.SECRET_ACCESS_KEY;

if(ACCESS_KEY_ID == null || SECRET_ACCESS_KEY == null){
  console.log("ERROR: s3 envirnoment variables not set!");
}

aws.config.update({
  accessKeyId: ACCESS_KEY_ID,
  secretAccessKey: SECRET_ACCESS_KEY
});


module.exports = function (io, db) {
  router.route('/s3-sign')
    .get(GETSignRequest)
    .post(POSTS3Sign);

  router.route('/mediaStatus')
    .post(POSTSNSNotify);

  /*
   * Respond to GET requests to /sign-s3.
   * Upon request, return JSON containing the temporarily-signed S3 request and
   * the anticipated URL of the image.
   */
  function GETSignRequest(req, res) {
    const s3 = new aws.S3({
        signatureVersion: 'v4',
        // Endpoint can be switched to https://media.futureboard.olin.build/' after we get an ssl cert for media.FUTUREboard.olin.build
        endpoint: new aws.Endpoint('https://s3.amazonaws.com')
      });
    const inputFileName = req.query['file-name'].split('.');
    const fileType = req.query['file-type'];
    const mediaType = fileType.split('/')[0]; // Get image or video
    const inputFileExtension = inputFileName[inputFileName.length - 1];
    let uploadFileName = '';
    let outputFileName = '';
    const new_uuid = uuidv1();

    if(mediaType === 'image'){
      uploadFileName = 'img-' + new_uuid + '.' + inputFileExtension;
      outputFileName = 'img-' + new_uuid + '.jpg';
    } else if (mediaType === 'video') {
      uploadFileName = 'vid-' + new_uuid + '.' + inputFileExtension;
      outputFileName = 'vid-' + new_uuid + '.mp4';
    } else {
      res.status(415).send('unsuported media type');
      return;
    }
    console.log(mediaType, fileType, uploadFileName);
    const s3Params = {
      Bucket: S3_BUCKET,
      Key: uploadFileName,
      Expires: 60,
      ContentType: fileType,
      ACL: 'public-read'
    };

    s3.getSignedUrl('putObject', s3Params, function (err, data) {
      if(err){
        console.log(err);
        return res.end();
      }
      const returnData = {
        signedRequest: data,
        // The location of the future media, to be used for previering and submitting a bob
        url: 'http://media.futureboard.olin.build/' + outputFileName
      };
      console.log(returnData);
      res.write(JSON.stringify(returnData));
      res.end();
    });
  }

  function POSTS3Sign(req, res) {
    res.send("success");
  }

  function POSTSNSNotify (req, res) {
    // Recieve all data
    var chunks = [];
    req.on('data', function (chunk) {
        chunks.push(chunk);
    });
    // After all data is received
    req.on('end', function () {
        try {
          var message = JSON.parse(chunks.join(''));
          // If it is a subscribtion confirmation, get the page
          if(req.headers['x-amz-sns-message-type'] === 'SubscriptionConfirmation'){
            request(message.SubscribeURL, function (err, res, body) {
              if(err){ console.log(err); }
            });
          // Else set the bob media status to true
          } else {
            var SNSmessage = JSON.parse(message.Message);
            SNSmessage.Records.forEach((record) => {
              if(record.s3.object.key.indexOf('/') == -1){
                db.Bob.setMediaStatus('http://media.futureboard.olin.build/' + record.s3.object.key, true)
                .then(function (bobData) {
                  io.emit('add_element', bobData);
                });

                console.log("s3 ready:", record.s3.object.key);
              }
            });
          }

        } catch (e) {
          // Errors caused by bad jso
          console.log(e);
          return;
        }
    });
    res.end();
  }

return router;
};
