// external dependencies
const express = require('express');
const path = require('path');
const app = express();
const bodyParser = require('body-parser');

// Start http server
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
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/templates/board.html');
});
app.get('/admin', function (req, res) {
  res.sendFile(__dirname + '/templates/admin.html');
});


// Send data to board
const controller = require('./routes/controllerRoutes')(io, db);
app.get('/controller' , controller.GETindex);
app.post('/controller', controller.POSTbob);
app.get('/flavors'    , controller.GETflavors);
app.get('/tags'       , controller.GETtags);
app.get('/editbob'    , controller.GETeditBob);
app.post('/editbob'   , controller.POSTeditBob);
app.get('/getbob'     , controller.GETbob);
app.post('/deletebob' , controller.POSTdeletebob);

// Handle api traffic
api = require('./routes/api')(io, db);
app.use('/api', api);

// Handle socket logic
require('./routes/sockets')(io, db);

const twilio = require('./routes/twilio')(io, db);
app.post('/twilio', twilio.POSTtext);

var port = process.env.PORT || 80;
http.listen(port, function() {
	console.log("FORWARDboard running on port", port);
});
