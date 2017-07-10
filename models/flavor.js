const mongoose = require('mongoose');

const flavorSchema = mongoose.Schema({
	name: String,
	fields: [{}],
});

const FlavorModel = mongoose.model('Flavor', flavorSchema);

function saveFlavor(flavorData) {
  const newFlavor = new FlavorModel({
		name: flavorData.name,
		fields: flavorData.fields
  });

  newFlavor.save(function (err) {
    if (err) console.log("flavor save error:", err);
  });
}


function getAllFlavors(filter) {
	return FlavorModel.find(filter);
}

function getFlavor(flavorName) {
	return FlavorModel.findOne({ name: flavorName});
}



let Flavors = {};

Flavors.model         = FlavorModel;
Flavors.saveFlavor    = saveFlavor;
Flavors.getAllFlavors = getAllFlavors;
Flavors.getFlavor     = getFlavor;

module.exports        = Flavors;
