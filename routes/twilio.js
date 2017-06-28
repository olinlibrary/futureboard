// External dependencies
const path = require('path');


module.exports = function(io, db) {
	
	var twilio = {};

	twilio.POSTtext = function(req, res, next) {
		var startDate = new Date();
		var endDate = new Date().setDate(startDate.getDate() + 7);

		console.log(req.body);
		var data = (Number(req.body.numMedia) > 0)? {Link: req.body.MediaUrl0} : {Text: req.body.Body};
		console.log(data);

		var bob = {
			data: data,
			flavor: "Image",
			startDate: startDate,
			endDate: endDate,
			tags: ["potluck"]
		}

		// db.Bob.saveBob(bob);
		res.send('success');
	};

	return twilio;
};
