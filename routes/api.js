// External dependencies
const path = require('path');

module.exports = function(io, db, app) {
  var api = {};

  app.get('/api', function (req, res) {
		res.sendFile(path.join(__dirname, '..', '/templates/api.html'));
	});

  app.get('/api/test/:id', function (req, res) {
    res.send(req.params.id);
  });

  api.GETbobs = function (req, res) {
    // Get all bobs
  };

  api.GETbob = function (req, res) {
		db.Bob.getOneBob({ _id: db.ObjectId(req.query.bobid) } ).then(function success(data) {
			res.send(data);
		}, function error(err) {
			res.status(500).send(err);
		});
  };

  api.POSTbobs = function (req, res) {

  };


  return api;
};
