// external dependencies
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
app.set('socketio', io);
const db = require('./models/wrapper.js');
const aws = require('aws-sdk');


/*
 NOTE: Currently connects to fake-s3 (https://github.com/jubos/fake-s3/).
 Switch to real production before merge
 To setup fakes3:
  gem install fakes3
  mkdir fakes3/
 start with:
  fakes3 -r fakes3/ -p 4567
*/

const S3_BUCKET         = process.env.S3_BUCKET;
const ACCESS_KEY_ID     = process.env.ACCESS_KEY_ID;
const SECRET_ACCESS_KEY = process.env.SECRET_ACCESS_KEY;

/*
 * Respond to GET requests to /sign-s3.
 * Upon request, return JSON containing the temporarily-signed S3 request and
 * the anticipated URL of the image.
 */
app.get('/sign-s3', (req, res) => {
  const s3 = new aws.S3({
      s3ForcePathStyle: true,
      accessKeyId: ACCESS_KEY_ID,
      secretAccessKey: SECRET_ACCESS_KEY,
      endpoint: new aws.Endpoint('http://10.25.9.138:4567')
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

  s3.getSignedUrl('putObject', s3Params, (err, data) => {
    if(err){
      console.log(err);
      return res.end();
    }
    const returnData = {
      signedRequest: data,
      // url: 'http://'+ S3_BUCKET + '.localhost:4567/'+ fileName
      url: 'http://10.25.9.138:4567/' + S3_BUCKET + '/' + fileName
    };
    res.write(JSON.stringify(returnData));
    res.end();
  });
});

app.post('/sign-s3', function (req, res) {
  console.log(req);
  res.send("success");
});

/******* CONFIG *******/
// Use body parser for requests
app.use(bodyParser.urlencoded({
  extended: true
}));


// Serve all files from static
app.use('/static', express.static(path.join(__dirname, '/static')));

// Handle api traffic
api = require('./routes/api')(io, db);
app.use('/api', api);


// Main board
app.get('/', function(req, res) {
  res.sendFile(__dirname + '/templates/board.html');
});

app.get('/new', function(req, res) {
  res.sendFile(__dirname + '/templates/controller.html');
});

app.get('/upload', function (req, res) {
  res.sendFile(__dirname + '/templates/uploadfile.html');
});

app.get('/admin', function(req, res) {
  res.sendFile(__dirname + '/templates/admin.html');
});

app.get('/bobs', api.GETallBobs);

// Show edit page on /bobs/:bobid
app.route('/bobs/:bobid')
  .get(function(req, res) {
    if(req.params.bobid.length === 24){
      db.Bob.getOneBob({ _id: db.ObjectId(req.params.bobid)}).then(function success(data) {
        if(data){
          res.sendFile(path.join(__dirname, '/templates/editbob.html'));
        } else {
          res.status(404).send("bob not found");
        }
      }, function error(err) {
        console.log(err);
      });
    } else {
      res.status(404).send("bob id must be 24 characters long");
    }
  });


// Handle socket logic
require('./routes/sockets')(io, db);

// Twilio input
const twilio = require('./routes/twilio')(io, db);
app.post('/twilio', twilio.POSTtext);


// Start the server
var port = process.env.PORT || 8080;
http.listen(port, function() {
	console.log("FORWARDboard running on port", port);
});
