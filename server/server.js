// A little bit of magic requires
const express = require('express');
const path = require('path');
const app = express();

// Start http server
const http = require('http').Server(app);
http.listen(8080);

const io = require('socket.io')(http);


var bobbles = {'elements': []};


app.get('/', function (req, res) {
  res.sendFile(__dirname + '/static/board.html');
});

app.get('/controller', function (req, res) {
  res.sendFile(__dirname + '/static/controller.html');
});



// Serve all files from static
app.use('/static', express.static(path.join(__dirname, '/static')));



// Start socket
io.on('connection', function(socket, msg){
  console.log("user connected");

  socket.emit('all_elements', bobbles);


  socket.on('add_element', function (msg) {
    bobbles.elements.push(msg);
    io.emit('add_element', msg);

    console.log('add_text', msg, '\n All elements:', bobbles.elements);
    // socket.emit('volumes', JSON.stringify(volumes));
    // io.emit('vizPositions', [position]);
    // console.log("sent volumes", volumes);
  });
});


console.log("FORWARDboard running on port 8080");
