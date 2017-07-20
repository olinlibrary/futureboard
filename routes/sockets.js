module.exports = function(io, db) {

	io.on('connection', function(socket) {
		console.log("socket connected");
	});
};
