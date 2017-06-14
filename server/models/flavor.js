const mongoose = require('mongoose');

getFlavors = function() {
	// In the future this will make a DB call instead
	return new Promise(function(fulfill, reject) {
		try {
			fulfill([{
				name: 'Quote',
				fields: [{
					input: "text",
					name: "Text"
				},{
					input: "text",
					name: "Author"
				}]
			},{
				name: 'Text',
				fields: [{
					input: "text",
					name: "Text"
				}]
			},{
				name: 'Video',
				fields: [{
					input: "text",
					name: "Link"
				}]
			}]);
		} catch (exception) {
			reject(exception)
		}
	});
};


let Flavors = {};

Flavors.getFlavors = getFlavors;

module.exports = Flavors;
