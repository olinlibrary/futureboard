module.exports = function(io, db) {

	io.on('connection', function(socket) {
		console.log("board connected");

		db.Bob.getActiveBobs().then(function (bobs) {
			socket.emit('all_elements', bobs);
		});

		socket.on('manual_control', function(command){
			socket.broadcast.emit('manual_control', command);
		});
	});
};
