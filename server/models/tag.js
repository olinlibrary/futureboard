const mongoose = require('mongoose');

const tagSchema = mongoose.Schema({
	name: String
});

const TagModel = mongoose.model('Tag', tagSchema);


getTags = function(filter) {
	return TagModel.find(filter);
};


var Tag = {};

Tag.model = TagModel;
Tag.getTags = getTags;

module.exports = Tag;
