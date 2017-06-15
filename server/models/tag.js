const mongoose = require('mongoose');

const tagSchema = mongoose.Schema({
	name: String
});

const TagModel = mongoose.model('Tag', tagSchema);


getTags = function(filter) {
	return TagModel.find(filter);
	// // In the future this will make a DB call instead
	// return new Promise(function(fulfill, reject) {
	// 	try {
	// 		fulfill(['BAJA', 'Formula', 'Library', 'PGP', 'FWOP', 'Cats']);
	// 	} catch (exception) {
	// 		reject(exception)
	// 	}
	// });
};


var Tag = {};

Tag.getTags = getTags;

module.exports = Tag;
