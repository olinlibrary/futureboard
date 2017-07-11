// external dependencies
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
app.set('socketio', io);
const db = require('./models/wrapper.js');


/******* CONFIG *******/
// Use body parser for requests
app.use(bodyParser.urlencoded({
  extended: true
}));


// Serve all files from static
app.use('/static', express.static(path.join(__dirname, '/static')));


// Main board
app.get('/', function(req, res) {
  res.sendFile(__dirname + '/templates/board.html');
});

app.get('/new', function(req, res) {
  res.sendFile(__dirname + '/templates/controller.html');
});

app.get('/admin', function(req, res) {
  res.sendFile(__dirname + '/templates/admin.html');
});

// Show edit page on /bobs/:bobid
app.route('/bobs/:bobid')
  .get(function(req, res) {
    res.sendFile(path.join(__dirname, '/templates/editbob.html'));
  });

// Handle api traffic
api = require('./routes/api')(io, db);
app.use('/api', api);

// Handle socket logic
require('./routes/sockets')(io, db);

// Twilio input
const twilio = require('./routes/twilio')(io, db);
app.post('/twilio', twilio.POSTtext);


// Start the server
var port = process.env.PORT || 80;
http.listen(port, function() {
	console.log("FORWARDboard running on port", port);
});
