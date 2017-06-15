
module.exports = function(socket, db) {
  console.log("board connected");

  db.Bob.getAllActiveBobs().then(function (bobList) {
    socket.emit('all_elements', bobList);
  });

  socket.on('add_element', function (msg) {
    socket.broadcast.emit('add_element', msg);

    db.Bob.saveBob(msg.data, msg.startDate, msg.endDate, msg.flavor, msg.tags);
  });
}
