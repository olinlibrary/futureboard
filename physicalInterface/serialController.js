const socket = require('socket.io-client')('http://forwardboard.herokuapp.com/');

var SerialPort = require("serialport");
var serialport = new SerialPort("/dev/ttyUSB0", {
  parser: SerialPort.parsers.readline('\n')
});

setInterval(function () {
  sendCommand('left');
}, 1000);

TOUCH_THRESHOLD = 1000;
CUR_TOUCHING = false;
xThresholds = {
  "left": 0.2,
  "right": 0.8
};


HIST_NUM_VALS = 250;
var touchHistory = new Array(HIST_NUM_VALS);

serialport.on('open', function(){
  console.log('Serial Port Opened');
  serialport.on('data', function(data){
      console.log(data);
      data = data.replace(/[^\x00-\x7F]/g, "");
      data = JSON.parse(data);
      var xVal = mapXFromRaw(data.left, data.right);
      console.log(xVal);
  });
});


function detectSwipe(xVal) {

}

function interpretValues(data) {
  if((data.left + data.right) / 2 > TOUCH_THRESHOLD) {
    CUR_TOUCHING = true;
    var cur_x = mapXFromRaw(data.left, data.right);
    if(cur_x < xThresholds.left){
      sendCommand('left');
    } else if (cur_x > xThresholds.right) {
      sendCommand('right');
    }

    appendNewX(mapXFromRaw(data.left, data.right));
  } else {
    CUR_TOUCHING = false;
    appendNewX(-1);
  }

  console.log(touchHistory);
}

function mapXFromRaw(left, right) {
  // Make more robust
  x = (left - right) / (left + right);

  if (x < 0) {
    console.log("Negative x!", x);
    x = 0;
  }

  return x;
}

function appendNewX(x) {
  if(touchHistory.length >= HIST_NUM_VALS){
    touchHistory.shift();
  }

  touchHistory.append(x);
}

function sendCommand(command) {
  socket.emit('manual_control', command);
  console.log("sent", command);
}
