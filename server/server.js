// external dependencies
const express = require('express');
const path = require('path');
const app = express();
const bodyParser = require('body-parser');

// Start http server
const http = require('http').Server(app);
http.listen(8080);

const io = require('socket.io')(http);


/******* CONFIG *******/
// Use body parser for requests
app.use(bodyParser.urlencoded({
  extended: true
}));
// Serve all files from static
app.use('/static', express.static(path.join(__dirname, '/static')));
const mongo = require('./models/wrapper.js');
console.log("Done importing mongo");


var bobList = [];


function nowPlusXMinutes(numMinutes) {
  let newDate = new Date(Date.now + numMinutes*60000);
  // newDate.setMinutes(newDate.getMinutes() + numMinutes);
  // console.log(newDate);
  return newDate;
}


// mongo.saveBob("A famous word", Date.now, nowPlusXMinutes(10), "Text", ["profound"]);

// mongo.getAllBobs().then(function (doc) {
//   console.log("All bobs:", doc);
// });
// // mongo.getAllBobs().then(console.log(doc));
// mongo.findOneBob({flavor: "Text"}).then(function (doc) {
//   console.log("One bob:", doc);
//   console.log(doc.data);
// });


// const index = require('./routes/index');
// app.get('/', index.home)


// Main board
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/templates/board.html');
});

// Send data to board
const controller = require('./routes/controllerRoutes');
app.get('/controller', controller.GETindex);
app.post('/controller', controller.POSTbob);
app.get('/flavors', controller.GETflavors);
app.get('/tags', controller.GETtags);

// Start socket
io.on('connection', function(socket, msg){
  console.log("user connected", msg);

  // if (msg === 'board') {
  console.log("sending all bobs to board");
  mongo.getAllBobs().then(function (bobList) {
    socket.emit('all_elements', bobList);
  });
  // }

  socket.on('add_element', function (msg) {
    io.emit('add_element', msg);

    mongo.saveBob(msg.data, msg.startTime, msg.endTime, msg.flavor, msg.tags);

    console.log('add_text', msg);
    // socket.emit('volumes', JSON.stringify(volumes));
    // io.emit('vizPositions', [position]);
    // console.log("sent volumes", volumes);
  });
});


console.log("FORWARDboard running on port 8080");
