// External dependencies
const path = require('path');
const re = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g

module.exports = function(io, db) {

	var twilio = {};

	twilio.POSTtext = function(req, res, next) {
		var startDate = new Date();
		var endDate = new Date().setDate(startDate.getDate() + 7);


		var data, flavor;
		if (Number(req.body.NumMedia) > 0) {
			data   = { "Link": req.body['MediaUrl0'] };
			flavor = "Image";
		} else if (req.body['Body'].match(re)) {
			data   = { "Link": req.body['Body'] };
			flavor = "Image";
		} else {
			data   = { "Text": req.body['Body'] };
			flavor = "Text";
		}

		var bob = {
			data:      data,
			flavor:    flavor,
			startDate: startDate,
			endDate:   endDate,
			tags:      ["potluck"]
		}

		io.emit('add_element', bob);

		db.Bob.saveBob(bob);
		res.send('success');
	};

	return twilio;
};
