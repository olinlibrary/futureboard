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

mongoose.connect('mongodb://localhost/test');

let db = mongoose.connection;
db.on('error', console.error.bind(console, 'mongoose connection error:'));

db.once('open', function(){
  console.log("connected to mongodb");
});



const bobSchema = mongoose.Schema({
  data: String,
  timeStart: { type: Date, default: Date.now() },
  timeEnd: Date,
  flavor: String,
  tags: []
});

let Bob = mongoose.model('Bob', bobSchema);


function saveBob(data, timeStart, timeEnd, flavor, tags) {
  let curBob = new Bob({
    data:       data,
    timeStart:  timeStart,
    timeEnd:    timeEnd,
    flavor:     flavor,
    tags:       tags
  });

  // console.log(timeEnd, curBob);

  curBob.save(function (err) {
    if (err) console.log("Bob save error:", err);
    else console.log("bob saved");
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

// function getAllKittens(callback) {
//   Kitten.find(function (err, kittens){
//     if (err) return console.error(err);
//     console.log("In getAllKittens", kittens);
//     callback(kittens);
//   });
// }
//
// module.exports.getAllKittens = getAllKittens;

// module.exports.connectToMongo = connectToMongo;



// var kittySchema = mongoose.Schema({
//   name: String
// });
//
// kittySchema.methods.speak = function () {
//   var greeting = this.name  ? "Meow name is " + this.name  : "I don't have a name";
//
//   console.log(greeting);
// };
//
//
// var Kitten = mongoose.model('Kitten', kittySchema);
//
//
// var silence = new Kitten({ name: 'Frank' });
// // console.log(silence.name);
//
// // silence.speak();
//
// silence.save(function (err, fluffy) {
//   if (err) return console.error(err);
//   fluffy.speak();
// });
//
// Kitten.find(function (err, kittens){
//   if (err) return console.error(err);
//   console.log(kittens);
//   console.log();
// });
//
// Kitten.find({ name: /^Sil/ }, function (err, kittens) {
//   console.log(kittens);
//   console.log();
// })
