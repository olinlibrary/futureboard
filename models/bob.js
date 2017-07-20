const mongoose = require('mongoose');


// Define and compile Bob Schema
const bobSchema = mongoose.Schema({
  data:      {},
  startDate: { type: Date, default: Date.now() },
  endDate:   { type: Date, default: Date.now() + 604800 }, // One week from now
  flavor:    String,
  tags:      [],
  votes:     { type: Number, default: 1 },
  flag:      { type: Number, default: 0 } // 0: OK, 1: Flagged, 2: Mod OK, 3: Mod Remove
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

  return newBob.save(function (err) {
    if (err) console.log("Bob save error:", err);
  });
}

function getBobs(filter) {
  return BobModel.find(filter).and({flag: [0, 2]}).sort('-startDate').lean();
}

function getOneBob(filter) {
  return BobModel.findOne(filter).and({flag: [0, 2]});
}

function getActiveBobs(filter) {
  let query = BobModel.find(filter).lean();
  query.and({flag: [0, 2]});  // If not flagged
  query.sort('-startDate');   // Sort newest to oldest
  query.limit(20);            // First n bobs
  return query;
}

function getFlaggedBobs(filter) {
  return BobModel.find(filter).and({ flag: 1 }).sort('-startDate').lean();
}

function updateBob(bobData) {
  return BobModel.update(
    { _id: bobData._id },
    {
      // Do not allow updating flavor
      data:      bobData.data,
      tags:      bobData.tags,
      startDate: bobData.startDate,
      endDate:   bobData.endDate,
      bobbleID:  bobData.bobbleID
    }
  );
}

function deleteBob(bobId) {
  return BobModel.remove(
    { _id: bobId}
  );
}

function upvoteBob(bobId) {
  return BobModel.findOneAndUpdate(
    { _id: bobId },
    {
      $inc: { votes: 1}  // Increment votes by 1
    }
  ).and({flag: [0, 2]}).lean();
}

function flagBob(bobId) {
  return BobModel.findOneAndUpdate({ _id: bobId }, { flag: 1 }).and({flag: [0, 2]}).lean();
}



let Bob = {};

Bob.model          = BobModel;
Bob.saveBob        = saveBob;
Bob.getBobs        = getBobs;
Bob.getOneBob      = getOneBob;
Bob.getActiveBobs  = getActiveBobs;
Bob.getFlaggedBobs = getFlaggedBobs;
Bob.updateBob      = updateBob;
Bob.deleteBob      = deleteBob;
Bob.upvoteBob      = upvoteBob;
Bob.flagBob        = flagBob;

module.exports     = Bob;
