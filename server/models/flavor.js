const mongoose = require('mongoose');

const flavorSchema = mongoose.Schema({
	name: String,
	fields: [{}],
});

const FlavorModel = mongoose.model('Flavor', flavorSchema);

saveFlavor = function(flavorData) {
  const newFlavor = new FlavorModel({
		name: flavorData.name,
		fields: flavorData.fields
  });

  newFlavor.save(function (err) {
    if (err) console.log("flavor save error:", err);
  });
};


getFlavors = function(filter) {
	return FlavorModel.find(filter);
};



let Flavors = {};

Flavors.model      = FlavorModel;
Flavors.saveFlavor = saveFlavor;
Flavors.getFlavors = getFlavors;

module.exports = Flavors;
