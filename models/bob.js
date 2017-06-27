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

function getBobs(filter) {
  return BobModel.find(filter);
}

function getOneBob(filter) {
  return BobModel.findOne(filter);
}

function getActiveBobs(filter) {
  let query = BobModel.find(filter);
  query.and({startDate: { $lte: Date.now() }, endDate: { $gte: Date.now() }});
  return query;
}


let Bob = {};

Bob.model = BobModel;
Bob.saveBob = saveBob;
Bob.getBobs = getBobs;
Bob.getOneBob = getOneBob;
Bob.getActiveBobs = getActiveBobs;

module.exports = Bob;
