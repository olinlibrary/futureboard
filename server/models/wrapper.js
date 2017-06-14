/*
	This file is meant to abstract calls to the database from route logic.

	Each call to the database should return a promise such that a route can
	pass relevant information to the wrapper function:

	***from other files the interaction should look like the following***
	db.getTags().then(function success(data) {
		... small amount of logic ...
		res.send(data);
	}, function error(err) {
		res.status(50X).send(err);
	});
*/

// For mocking up DB interactions
const Promise = require('promise');

// Schemas we define:
const Bob = require('./bob');
const Tag = require('./tag');


var dbWrapper = {};

dbWrapper.getTags = function() {
	// In the future this will make a DB call instead
	return new Promise(function(fulfill, reject) {
		try {
			fulfill(['BAJA', 'Formula', 'Library', 'PGP', 'FWOP', 'Cats']);
		} catch (exception) {
			reject(exception)
		}
	});
}

dbWrapper.getFlavors = function() {
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
}

module.exports = dbWrapper;
