// external dependencies
const express    = require('express');
const app        = express();
const path       = require('path');
const bodyParser = require('body-parser');
const db         = require('./models/wrapper.js');
const enforce    = require('express-sslify');
const http       = require('http').Server(app);

// Start the server
if(process.env.NODE_ENV === 'production'){
  app.use(enforce.HTTPS({ trustProtoHeader: true }));
}

port = process.env.PORT | 8080;
http.listen(port, function() {
  console.log("FORWARDboard running over http on port", port);
});


const io = require('socket.io')(http);
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
