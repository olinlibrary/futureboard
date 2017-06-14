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

//DB Code: Implement into portion above

var mongoose = require('mongoose');

// Use JS native promises
mongoose.Promise = global.Promise;


// Connect to db
mongoose.connect('mongodb://localhost/test');

let db = mongoose.connection;
db.on('error', console.error.bind(console, 'mongoose connection error:'));

db.once('open', function(){
  console.log("Connected to mongodb");
});


// Define and compile Bob Schema
const bobSchema = mongoose.Schema({
  data: String,
  timeStart: { type: Date, default: Date.now() },
  timeEnd: Date,
  flavor: String,
  tags: []
});

let Bob = mongoose.model('Bob', bobSchema);


// Bob functions
function saveBob(data, timeStart, timeEnd, flavor, tags) {
  let curBob = new Bob({
    data:       data,
    timeStart:  timeStart,
    timeEnd:    timeEnd,
    flavor:     flavor,
    tags:       tags
  });

  curBob.save(function (err) {
    if (err) console.log("Bob save error:", err);
  });
}

function getAllBobs(filter) {
  return Bob.find(filter);
}

function getOneBob(filter) {
  return Bob.findOne(filter);
}

function getAllActiveBobs(filter) {
  let query = Bob.find(filter);
  query.and({timeStart: { $lte: Date.now() }, timeEnd: { $gte: Date.now() }});
  return query;
}


module.exports.saveBob = saveBob;
module.exports.getAllBobs = getAllBobs;
module.exports.getOneBob = getOneBob;
module.exports.getAllActiveBobs = getAllActiveBobs;
