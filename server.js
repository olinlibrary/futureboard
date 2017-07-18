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

// Handle api traffic
api = require('./routes/api')(io, db);
app.use('/api', api);


// Main board (on computer screens)
app.get('/', function(req, res) {
  res.sendFile(__dirname + '/templates/board.html');
});


app.get('/views', function(req, res) {
  res.sendFile(__dirname + '/templates/views.html');
});

app.get('/views/board', function(req, res) {
  res.sendFile(__dirname + '/templates/board.html');
});
// Stream only View
app.get('/views/stream', function(req, res) {
  res.sendFile(__dirname + '/templates/stream.html');
});

// Events only View
app.get('/views/events', function(req, res) {
  res.sendFile(__dirname + '/templates/events.html');
});

app.get('/new', function(req, res) {
  res.sendFile(__dirname + '/templates/controller.html');
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
