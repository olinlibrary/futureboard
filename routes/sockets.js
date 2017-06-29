module.exports = function(io, db) {

	io.on('connection', function(socket) {
		console.log("board connected");

		db.Bob.getActiveBobs().then(function (bobList) {
			socket.emit('all_elements', bobList);
		});

		socket.on('manual_control', function(command){
			io.broadcast('manual_control', command);
		});
	});

}
