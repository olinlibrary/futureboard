// external dependencies
const express    = require('express');
const app        = express();
const path       = require('path');
const bodyParser = require('body-parser');
const db         = require('./models/wrapper.js');

// Start the server
let SERVER;
// If running in Heroku
if(process.env.PORT) {
  const http = require('http').Server(app);
  SERVER = http;
  http.listen(process.env.PORT, function() {
  	console.log("FORWARDboard running over http on port", process.env.PORT);
  });
} else {
  const httpredirect = require('./routes/httpredirect');
  const tls = require("tls");
  const fs = require('fs');

  var httpsOptions = {
    key:  fs.readFileSync('server.key'),
    cert: fs.readFileSync('cert.pem')
  };
  const https = require('https').Server(httpsOptions, app);
  SERVER = https;

  https.listen(443, function() {
  	console.log("FORWARDboard running over https on port", 443);
  });

  httpredirect.listen(80, function() {
    console.log("httpredirect running on port", 80);
  });
}

const io = require('socket.io')(SERVER);
app.set('socketio', io);



/******* CONFIG *******/
// Use body parser for requests
app.use(bodyParser.urlencoded({
  extended: true
}));


// Serve all files from static
app.use('/static', express.static(path.join(__dirname, '/static')));

// Handle api traffic
const api = require('./routes/api')(io, db);
app.use('/api', api);

// Handle s3 file uploading
const awsApi = require('./routes/awsapi')(io, db);
app.use('/aws', awsApi);


// Main board (on computer screens)
const browserRoutes = require('./routes/browser')(api, __dirname);
app.use('/', browserRoutes);


// Handle socket logic
require('./routes/sockets')(io, db);

// Twilio input
const twilio = require('./routes/twilio')(io, db);
app.post('/twilio', twilio.POSTtext);
