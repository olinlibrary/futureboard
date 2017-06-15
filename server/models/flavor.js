const mongoose = require('mongoose');

const flavorSchema = mongoose.Schema({
	name: String,
	fields: [{}],
});

const FlavorModel = mongoose.model('Flavor', flavorSchema);

getFlavors = function(filter) {
	return FlavorModel.find(filter);
};


let Flavors = {};

Flavors.model = FlavorModel;
Flavors.getFlavors = getFlavors;

module.exports = Flavors;
