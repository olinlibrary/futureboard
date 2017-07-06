// External dependencies
const path = require('path');


module.exports = function(io, db) {
	var controller = {};

	controller.GETindex = function(req, res, next) {
		res.sendFile(path.join(__dirname, '..', '/templates/controller.html'));
	};

	controller.POSTbob = function(req, res, next) {

		if(!req.body.endDate){
			req.body.endDate = Date.now() + 2 * 60 * 60 * 12; // Default to two days
		}

		var bob = {
			data: req.body.data,
			flavor: req.body.flavor,
			startDate: req.body.startDate,
			endDate: req.body.endDate,
			tags: req.body.tags
		}

		// Send to all boards
		io.emit('add_element', bob);

		// Save in db
		db.Bob.saveBob(bob);

		res.send("success")
	};

	controller.GETflavors = function(req, res) {
	  db.Flavors.getFlavors().then(function success(data) {
	    res.send(data);
	  }, function error(err) {
	    res.status(500).send(err);
	  });
	};

	controller.GETtags = function(req, res) {
	  db.Tag.getTags().then(function success(data) {
	    res.send(data);
	  }, function error(err) {
	    res.status(500).send(err);
	  });
	};

	return controller;
};
