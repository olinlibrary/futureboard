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

	controller.POSTupdatebob = function(req, res, next) {
		var bob = {
			_id:			 ObjectID(req.body.id),
			data:      req.body.data,
			flavor:    req.body.flavor,
			startDate: req.body.startDate,
			endDate:   req.body.endDate,
			tags:      req.body.tags
		}

		// Needs error checking
		db.Bob.updateBob(bob);

		res.send("update successful");
	}

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

	controller.GETeditBob = function (req, res) {
		res.sendFile(path.join(__dirname, '..', '/templates/editbob.html'));
	};

	controller.POSTeditBob = function (req, res) {
		// console.log(req.body);
		var bob = {
			_id:			 db.ObjectId(req.body.id),
			data:      req.body.data,
			flavor:    req.body.flavor,
			startDate: req.body.startDate,
			endDate:   req.body.endDate,
			tags:      req.body.tags
		}

		// Needs error checking and input sanitation
		io.emit('update_element', bob);
		db.Bob.updateBob(bob).then(function success(data) {
			res.send("update successful");
		}, function error(err) {
			res.status(500).send(err);
		});

	}

	controller.GETbob = function (req, res) {
		db.Bob.getOneBob({ _id: db.ObjectId(req.query.bobid) } ).then(function success(data) {
			res.send(data);
		}, function error(err) {
			res.status(500).send(err);
		});
	}

	return controller;
};
