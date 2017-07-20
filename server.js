// external dependencies
const express    = require('express');
const app        = express();
const path       = require('path');
const bodyParser = require('body-parser');
const db         = require('./models/wrapper.js');
const httpredirect = require('./routes/httpredirect');

// Import ssl certificate and start https server (Required by s3)
const tls = require("tls");
const fs = require('fs');

var httpsOptions = {
  key:  fs.readFileSync('server.key'),
  cert: fs.readFileSync('cert.pem')
};
const https = require('https').Server(httpsOptions, app);

const io = require('socket.io')(https);
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
const s3 = require('./routes/s3api')();
app.use('/sign-s3', s3);


// Main board (on computer screens)
const browserRoutes = require('./routes/browser')(api, __dirname);
app.use('/', browserRoutes);


// Handle socket logic
require('./routes/sockets')(io, db);

// Twilio input
const twilio = require('./routes/twilio')(io, db);
app.post('/twilio', twilio.POSTtext);


// Start the server
const HTTPport = process.env.PORT || 80;
const HTTPSport = 443
https.listen(HTTPSport, function() {
	console.log("FORWARDboard running over https on port", HTTPSport);
});

httpredirect.listen(HTTPport, function() {
  console.log("httpredirect running on port", HTTPport);
});
