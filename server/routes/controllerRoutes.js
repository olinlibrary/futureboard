
var controller = {};
const path = require('path');

controller.GETindex = function(req, res) {
	res.sendFile(path.join(__dirname, '..', '/templates/controller.html'));
}

controller.POSTbob = function(req, res) {
	var data = {
		data: req.body.data,
		flavor: req.body.flavor,
		start: req.body.start,
		end: req.body.end,
		tags: req.body.tags
	}

	console.log(data);
}

module.exports = controller;
