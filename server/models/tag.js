const mongoose = require('mongoose');

const tagSchema = mongoose.Schema({
	title: String
});

const TagModel = mongoose.model('Tag', tagSchema);

function saveTag(tagData) {
  const newTag = new TagModel({
		title: tagData.title
  });

  newTag.save(function (err) {
    if (err) console.log("tag save error:", err);
  });
}


function getTags(filter) {
	return TagModel.find(filter);
}


var Tag = {};

Tag.model = TagModel;
Tag.saveTag = saveTag;
Tag.getTags = getTags;

module.exports = Tag;
