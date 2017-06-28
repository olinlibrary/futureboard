// External dependencies
const path = require('path');


module.exports = function(io, db) {
	
	var twilio = {};

	twilio.POSTtext = function(req, res, next) {
		var startDate = new Date();
		var endDate = new Date().setDate(startDate.getDate() + 7);

		console.log(req.body['MediaUrl0']);
		var link = (Number(req.body.numMedia) > 0)? req.body['MediaUrl0'] : req.body.Body;
		console.log(link);

		var bob = {
			data: {Link: link},
			flavor: "Image",
			startDate: startDate,
			endDate: endDate,
			tags: ["potluck"]
		}

		io.emit('add_element', bob);

		db.Bob.saveBob(bob);
		res.send('success');
	};

	return twilio;
};
