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

mongoose.connect('mongodb://localhost/test');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'mongoose connection error:'));
db.once('open', function(){
  console.log("connected to mongodb");
  for(var x=0; x<3999999999; x++){ };
  console.log("Done with for loop");
  getAllKittens(function (kittens) {
    console.log("In wrapper:", kittens);
  });
});

var kittySchema = mongoose.Schema({
  name: String
});

var Kitten = mongoose.model('Kitten', kittySchema);


function getAllKittens(callback) {
  Kitten.find(function (err, kittens){
    if (err) return console.error(err);
    console.log("In getAllKittens", kittens);
    callback(kittens);
  });
}

module.exports.getAllKittens = getAllKittens;

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
