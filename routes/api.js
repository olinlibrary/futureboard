// External dependencies
const path = require('path');
const express = require('express');
var router = express.Router();


module.exports = function(io, db) {

  // router.use(function timeLog(req, res, next) {
  //   console.log('Time: ', Date.now());
  //   next();
  // });


  // Routing
  router.route('/')
    .get(GETapiGuide);

  router.route('/bobs')
    .get(GETallActiveBobs)
    .post(createNewBob);

  router.route('/bobs/:bobid')
    .get(GETbob)
    .put(PUTbob)
    .delete(DELETEbob);

  router.route('/flavors')
    .get(GETflavors);

  router.route('/flavors/:flavorname')
    .get(GETflavor);

  // Functions below
  function ensureAuthenticated(req, res, next) {
    if(req.query.auth === 'hunter2'){
      next();
    } else {
      res.status(401).send("User not authenticated");
    }
  }

  function GETapiGuide(req, res) {
    res.sendFile(path.join(__dirname, '..', '/templates/api.html'));
  }

  function GETallActiveBobs(req, res) {
    // Get all bobs
    db.Bob.getActiveBobs().then(function(bobs) {
      res.send(bobs);
    });
  }

  function createNewBob(req, res, next) {
    if(!req.body.endDate){
      req.body.endDate = Date.now() + 2 * 60 * 60 * 12; // Default to two days
    }

    var bob = {
      data:      req.body.data,
      flavor:    req.body.flavor,
      startDate: req.body.startDate,
      endDate:   req.body.endDate,
      tags:      req.body.tags
    };


    // Save in db
    db.Bob.saveBob(bob).then(function success(bobData) {
      // Send to all boards
      io.emit('add_element', bobData);
      res.send("success");
    }, function error(err) {
      res.status(500).send(err);
    });
  }

  function GETbob(req, res) {
    db.Bob.getOneBob({ _id: db.ObjectId(req.params.bobid) } ).then(function success(data) {
      res.send(data);
    }, function error(err) {
      res.status(500).send(err);
    });
  }

  function PUTbob(req, res) {
    // console.log(req.body);
    var bob = {
      _id:			 db.ObjectId(req.body.id),
      data:      req.body.data,
      flavor:    req.body.flavor,
      startDate: req.body.startDate,
      endDate:   req.body.endDate,
      tags:      req.body.tags
    };

    // Needs error checking and input sanitation
    io.emit('update_element', bob);
    db.Bob.updateBob(bob).then(function success(data) {
      res.send("update successful");
    }, function error(err) {
      res.status(500).send(err);
    });
  }

  function DELETEbob(req, res) {
    db.Bob.deleteBob(db.ObjectId(req.params.bobid)).then(function success(data) {
      res.send("Success");
    }, function error(err) {
      res.status(500).send(err);
    });
  }

  function GETflavors(req, res) {
    db.Flavors.getAllFlavors().then(function success(data) {
	    res.send(data);
	  }, function error(err) {
	    res.status(500).send(err);
	  });
  }

  function GETflavor(req, res) {
    db.Flavors.getFlavor(req.params.flavorname).then(function success(data) {
	    res.send(data);
	  }, function error(err) {
	    res.status(500).send(err);
	  });
  }


  return router;
};
