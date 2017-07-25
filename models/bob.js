const mongoose = require('mongoose');
const request = require('request');

// Define and compile Bob Schema
const bobSchema = mongoose.Schema({
  data:       {},
  startDate:  { type: Date, default: Date.now() },
  endDate:    { type: Date, default: Date.now() + 604800 }, // One week from now
  flavor:     String,
  tags:       [],
  votes:      { type: Number, default: 1 },
  flag:       { type: Number, default: 0 }, // 0: OK, 1: Flagged, 2: Mod OK, 3: Mod Remove
  mediaReady: { type: Boolean, default: false }
});

const BobModel = mongoose.model('Bob', bobSchema);


// Bob functions

/**
  Create and save a new bob in the db
  @param {Object[]} bobData
*/
function saveBob(bobData) {
  if(bobData.data.Link) {
    const mediaStatus = getMediaStatus(bobData.data.Link);
  } else {
    const mediaStatus = true;
  }
  const newBob = new BobModel({
    data:       bobData.data,
    startDate:  bobData.startDate,
    endDate:    bobData.endDate,
    flavor:     bobData.flavor,
    tags:       bobData.tags,
    mediaReady: mediaStatus
  });

  return newBob.save(function (err) {
    if (err) console.log("Bob save error:", err);
  });
}

/**
 * Get the status of a media
 * @param {String} url
 * @returns {Boolean} exists
 */
function getMediaStatus(url) {
  request.head(url, function (err, res, body) {
    // console.log(res);
    if(err){ console.log(err); }
    return (res.statusCode == 200);
  });
}
/**
  Gets all bobs
  @param {Object[]} [filter] - Optional mongoose filter
*/
function getBobs(filter) {
  return BobModel.find(filter).and({flag: [0, 2]}).sort('-startDate').lean();
}

/**
  Gets the first matching bob
  @param {Object[]} [filter] - Optional mongoose filter
*/
function getOneBob(filter) {
  return BobModel.findOne(filter).and({flag: [0, 2]});
}

/**
  Gets all active bobs - First maxBobs that aren't flagged
  @param {Object[]} [filter] - Optional mongoose filter
  @param {Object[]} [maxBobs=20] - Number of bobs to return
*/
function getActiveBobs(filter, maxBobs = 20) {
  // Get first maxBobs bobs that aren't flagged. Can flesh out with fancier algorithms in the future
  let query = BobModel.find(filter).lean();
  query.and({flag: [0, 2]});  // If not flagged
  query.and({mediaReady: true}); // Only bobs with media ready
  query.sort('-startDate');   // Sort newest to oldest
  query.limit(maxBobs);       // First n bobs
  return query;
}

/**
  Gets all flagged bobs
  @param {Object[]} [filter] - Optional mongoose filter
*/
function getFlaggedBobs(filter) {
  return BobModel.find(filter).and({ flag: 1 }).sort('-startDate').lean();
}

/**
  Update an existing bob in the db. Checks for _id.
  Allows editing: data, tags, startDate, endDate
  @param {Object[]} bobData
*/
function updateBob(bobData) {
  return BobModel.update(
    { _id: bobData._id },
    {
      // Do not allow updating flavor
      data:      bobData.data,
      tags:      bobData.tags,
      startDate: bobData.startDate,
      endDate:   bobData.endDate
    }
  );
}

/**
  Removes a bob from the db
  @param {Object[]} bobId - ObjectId of bob to delete
*/
function deleteBob(bobId) {
  return BobModel.remove(
    { _id: bobId}
  );
}

/**
  Upvotes a bob
  @param {Object[]} bobId - ObjectId of bob to upvote
*/
function upvoteBob(bobId) {
  return BobModel.findOneAndUpdate(
    { _id: bobId },
    {
      $inc: { votes: 1}  // Increment votes by 1
    }
  ).and({flag: [0, 2]}).lean();
}

/**
  Flags a bob for moderation
  @param {Object[]} bobId - ObjectId of bob to flag
*/
function flagBob(bobId) {
  return BobModel.findOneAndUpdate({ _id: bobId }, { flag: 1 }).and({flag: [0, 2]}).lean();
}


/**
  Sets a bob's mediaReady status
  @param {String} mediaURL - URL that is ready
  @param {Boolean} [status=true] - status of media to set
*/
function setMediaStatus(mediaURL, status = true) {
  return BobModel.findOneAndUpdate({ data: { Link: mediaURL }}, { mediaReady: true }).lean();
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
Bob.setMediaStatus = setMediaStatus;

module.exports     = Bob;
