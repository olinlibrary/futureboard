const mongoose = require('mongoose');

const tagSchema = mongoose.Schema({
	title: String
});

const TagModel = mongoose.model('Tag', tagSchema);


getTags = function(filter) {
	return TagModel.find(filter);
};


var Tag = {};

Tag.getTags = getTags;

module.exports = Tag;
