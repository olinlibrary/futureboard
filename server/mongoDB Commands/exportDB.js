const mongoose = require('mongoose');
const fs = require('fs');

const Bob = require('../models/bob');
const Flavor = require('../models/flavor');
const Tag = require('../models/tag');

mongoose.Promise = global.Promise;
let db = mongoose.connect('mongodb://localhost/test').connection;

db.on('open', function () {
  console.log('db connected');

  Flavor.getFlavors().then( function (flavors) {
    return saveObjects('flavors.json', flavors);
  }).then( function () {
    return Tag.getTags().then( function (tags) {
      return saveObjects('tags.json', tags);
    });
  }).then( function () {
    return Bob.getBobs().then( function (bobs) {
      return saveObjects('bobs.json', bobs);
    });
  }).then( function () {
    console.log("done saving");
    process.exit();
  }).catch( function (err) {
    console.log('cought err' + err);
    process.exit();
  });
});


function saveObjects(filename, objects) {
  return new Promise(function(resolve, reject) {
    fs.writeFile(filename, JSON.stringify(objects), (err) => {
      if (err) reject(err);
      else resolve("objects saved");
    });
  });
}
