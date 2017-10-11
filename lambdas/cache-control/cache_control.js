'use strict';
//source code from : https://github.com/tooltwist/documentation/wiki/Configure-AWS-Lambda-to-Automatically-Set-Cache-Control-Headers-on-S3-Objects
// CONFIGURATION //////////////////////////////////////////////
var CacheControlHeader = 'max-age=31536000'; // one year
var ContentEncodingHeader = 'gzip';
var ContentTypeHeader = 'application/javascript';
///////////////////////////////////////////////////////////////

let aws = require('aws-sdk');
let s3 = new aws.S3({ apiVersion: '2006-03-01' });

exports.handler = (event, context, callback) => {
    const bucket = event.Records[0].s3.bucket.name;
    const key = decodeURIComponent(event.Records[0].s3.object.key.replace('/+/g', ' '));
    var params = { Bucket: bucket, Key: key };
    s3.getObject(params, (err, data) => {
        if (err) {
            console.log(err);
            var message = 'Error: Failed to get object: s3://'+bucket+'/'+key +'. Make sure it is in the same region as this function!';
            console.log(message);
        } else {
        const mimeHeader = data.ContentType;
            if (data.CacheControl != CacheControlHeader) {
                var params = { Bucket: bucket, Key: key, CopySource: encodeURIComponent(bucket+'/'+key), CacheControl: CacheControlHeader, ContentEncoding: ContentEncodingHeader, ContentType: ContentTypeHeader,  'Metadata':{}, MetadataDirective: 'REPLACE' };
                s3.copyObject(params, (err, data) => {
                    if (err) {
                        console.log(err);
                        message = 'Error: Failed to get object: s3://'+bucket+'/'+key +'. Make sure it is in the same region as this function!';
                        console.log(message);
                    } else {
                       message = 'Metadata updated successfully! OBJECT: s3://'+bucket+'/'+key+' CACHE-CONTROL: '+CacheControlHeader+' CONTENT-ENCODING: '+ContentEncodingHeader+' CONTENT-TYPE: '+ContentTypeHeader;
                       console.log(message);
                    }
                });
            } else {
                message = 'Metadata updated successfully! OBJECT: s3://'+bucket+'/'+key+' CACHE-CONTROL: '+CacheControlHeader+' CONTENT-ENCODING: '+ContentEncodingHeader+' CONTENT-TYPE: '+ContentTypeHeader;
                console.log(message);
            }
        }
    });
    // Sends SNS Notification
    var eventText = JSON.stringify(event, null, 2);
    console.log("Received event:", eventText);
    var sns = new aws.SNS();
    var params1 = {
        Message: eventText,
        Subject: "MediaReadySNS",
        TopicArn: "arn:aws:sns:us-east-1:777614461374:futureboardMediaReady" // need to upload the Arn if you change the SNS settings
    };
    sns.publish(params1, context.done);
};
