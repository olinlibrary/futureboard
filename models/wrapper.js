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

const mongoose = require('mongoose');

// Use JS native promises
mongoose.Promise = global.Promise;

// Connect to db
const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost/test';
connectToDB(mongoURI);


// Schemas we define:
const Bob = require('./bob');
const Tag = require('./tag');
const Flavors = require('./flavor');




var dbWrapper = {};

dbWrapper.Bob     = Bob;
dbWrapper.Tag     = Tag;
dbWrapper.Flavors = Flavors;

module.exports    = dbWrapper;


function connectToDB(url) {
  mongoose.connect(url);
  let db = mongoose.connection;

  db.on('error', console.error.bind(console, 'mongoose connection error:'));

  db.once('open', function(){
    console.log("Connected to mongodb");
  });
}
