const mongoose = require('mongoose');

getTags = function() {
	// In the future this will make a DB call instead
	return new Promise(function(fulfill, reject) {
		try {
			fulfill(['BAJA', 'Formula', 'Library', 'PGP', 'FWOP', 'Cats']);
		} catch (exception) {
			reject(exception)
		}
	});
};

var Tag = {};

Tag.getTags = getTags;

module.exports = Tag;
