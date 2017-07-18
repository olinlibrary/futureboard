/*
Main Futureboard general JS components :
*/

// Socket.io configuration
var socket = io();
socket.emit('connection');

console.log('board.js is running');
