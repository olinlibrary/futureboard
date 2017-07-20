/*
This file holds all aws s3 upload routes.
*/

const aws = require('aws-sdk');
const express = require('express');
var router = express.Router();


/*
  set envirnoment variables: ACCESS_KEY_ID, SECRET_ACCESS_KEY
*/

const S3_BUCKET         = "media.futureboard.olin.build";
const ACCESS_KEY_ID     = process.env.ACCESS_KEY_ID;
const SECRET_ACCESS_KEY = process.env.SECRET_ACCESS_KEY;

if(ACCESS_KEY_ID == null || SECRET_ACCESS_KEY == null){
  console.log("ERROR: s3 envirnoment variables not set!");
}


module.exports = function () {
  router.route('/')
    .get(GETSignRequest)
    .post(POSTS3Sign);

  /*
   * Respond to GET requests to /sign-s3.
   * Upon request, return JSON containing the temporarily-signed S3 request and
   * the anticipated URL of the image.
   */
  function GETSignRequest(req, res) {
    const s3 = new aws.S3({
        accessKeyId: ACCESS_KEY_ID,
        secretAccessKey: SECRET_ACCESS_KEY,
        signatureVersion: 'v4',
        region: 'us-east-2',
        // Endpoint can be switched to https://media.futureboard.olin.build/' after we get an ssl cert for media.FUTUREboard.olin.build
        endpoint: new aws.Endpoint('https://s3.us-east-2.amazonaws.com')
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
  };

  function POSTS3Sign(req, res) {
    res.send("success");
  };
  return router;
};
