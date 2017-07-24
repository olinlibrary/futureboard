/*
This file holds all aws s3 upload routes.
*/

const aws = require('aws-sdk');
const request = require('request');
const express = require('express');
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
    .get(function (req, res) {
      console.log(req.body);
    })
    .post(function (req, res) {

      var chunks = [];
      req.on('data', function (chunk) {
          chunks.push(chunk);
      });
      req.on('end', function () {
          var message = JSON.parse(chunks.join(''));
          if(req.headers['x-amz-sns-message-type'] === 'SubscriptionConfirmation'){
            request(message.SubscribeURL, function (err, res, body) {
              if(err){ console.log(err); }
            });
          } else {
            var SNSmessage = JSON.parse(message.Message);
            // console.log(SNSmessage.Records);
            // console.log("---");
            SNSmessage.Records.forEach((record) => {
              if(record.s3.object.key.indexOf('/') == -1){
                db.Bob.setMediaStatus('http://media.futureboard.olin.build/' + record.s3.object.key, true)
                  .then(function (bobData) {
                    io.emit('add_element', bobData);
                  });

                console.log(record.s3.object.key);
              }
            });
          }


      });
      res.end();


    });



  return router;
};


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
  const fileName = req.query['file-name'];
  const fileType = req.query['file-type'];
  const s3Params = {
    Bucket: S3_BUCKET,
    Key: fileName,
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
      url: 'http://media.futureboard.olin.build/' + fileName
    };
    res.write(JSON.stringify(returnData));
    res.end();
  });
}

function POSTS3Sign(req, res) {
  res.send("success");
}
