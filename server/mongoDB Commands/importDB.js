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

    var i = 0;

    switch (collectionName) {
      case 'flavors':
        for(i=0; i<objects.length; i++){
          Flavor.saveFlavor(objects[i]);
        }
        break;

      case 'tags':
        for(i=0; i<objects.length; i++){
          Tag.saveTag(objects[i]);
        }
        break;

      case 'bobs':
        for(i=0; i<objects.length; i++){
          Bob.saveBob(objects[i]);
        }
        break;

      default:
        console.log("unknown collection " + collectionName);
    }

    console.log('done');
    process.exit();
  });
});
