const mongoose = require('mongoose');


// Define and compile Bob Schema
const bobSchema = mongoose.Schema({
  data: {},
  startDate: { type: Date, default: Date.now() },
  endDate: Date,
  flavor: String,
  tags: []
});

const BobModel = mongoose.model('Bob', bobSchema);


// Bob functions
function saveBob(bobData) {
  const newBob = new BobModel({
    data:       bobData.data,
    startDate:  bobData.startDate,
    endDate:    bobData.endDate,
    flavor:     bobData.flavor,
    tags:       bobData.tags
  });

  newBob.save(function (err) {
    if (err) console.log("Bob save error:", err);
  });
}

function getAllBobs(filter) {
  return BobModel.find(filter);
}

function getOneBob(filter) {
  return BobModel.findOne(filter);
}

function getAllActiveBobs(filter) {
  let query = BobModel.find(filter);
  query.and({startDate: { $lte: Date.now() }, endDate: { $gte: Date.now() }});
  return query;
}


let Bob = {};

Bob.saveBob = saveBob;
Bob.getAllBobs = getAllBobs;
Bob.getOneBob = getOneBob;
Bob.getAllActiveBobs = getAllActiveBobs;


module.exports = Bob;
