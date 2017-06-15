module.exports = function(socket, db) {
  console.log("board connected");

  db.Bob.getAllActiveBobs().then(function (bobList) {
    socket.emit('all_elements', bobList);
  });
}
