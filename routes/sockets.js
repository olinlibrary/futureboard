module.exports = function(io, _db) {

	io.on('connection', function(_socket) {
		console.log("socket connected");
	});
};
