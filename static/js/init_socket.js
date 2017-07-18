// Socket.io initialization
var socket = io();
socket.emit('connection');
console.log('board.js is running');
