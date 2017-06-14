// A little bit of magic requires
const express = require('express');
const path = require('path');
const app = express();

const db = require('./models/wrapper');

// Start http server
const http = require('http').Server(app);
http.listen(8080);

const io = require('socket.io')(http);
var board_elements = {'elements': []};


// Main board
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/templates/board.html');
});

// Send data to board
const controller = require('./routes/controllerRoutes');
app.get('/controller', controller.GETindex);
app.post('/controller', controller.POSTbob);

// Serve all files from static
app.use('/static', express.static(path.join(__dirname, '/static')));

// Serve up tags
app.get('/tags', function(req, res) {
  db.getTags().then(function success(data) {
    res.send(data);
  }, function error(err) {
    res.status(500).send(err);
  })
});

// Start socket
io.on('connection', function(socket, msg){
  console.log("user connected");

  socket.emit('all_elements', board_elements);


  socket.on('add_element', function (msg) {
    board_elements.elements.push(msg);
    io.emit('add_element', msg);

    console.log('add_text', msg, '\n All elements:', board_elements.elements);
    // socket.emit('volumes', JSON.stringify(volumes));
    // io.emit('vizPositions', [position]);
    // console.log("sent volumes", volumes);
  });
});


console.log("FORWARDboard running on port 8080");
