const mongoose = require('mongoose');
const fs = require('fs');

const Bob = require('../models/bob');
const Flavor = require('../models/flavor');
const Tag = require('../models/tag');

let db = mongoose.connect('mongodb://localhost/test').connection;

const collectionName = process.argv[2];

db.on('open', function () {

  fs.readFile(collectionName + '.json', 'utf8', (err, data) => {
    objects = JSON.parse(data);
    console.log('importing', objects.length, collectionName, 'from', collectionName + '.json');


    switch (collectionName) {
      case 'flavors':
        objects.forEach(function (object) {
          Flavor.saveFlavor(object);
        });
        break;

      case 'tags':
        objects.forEach(function (object) {
          Tag.saveTag(object);
        });
        break;

      case 'bobs':
        objects.forEach(function (object) {
          Bob.saveBob(object);
        });
        break;

      default:
        console.log("unknown collection " + collectionName);
    }

    console.log('done');
    process.exit();
  });
});
