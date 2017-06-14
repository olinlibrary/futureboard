function submit_text(text_value) {
  var text_object = {'type': 'text', 'value': text_value};

  socket.emit('add_element', text_object);
  console.log("submitted", text_object);
}




var socket = io();
socket.emit('connection', 'controller');
console.log("controller.js running");
