// External dependencies
const path = require('path');
const express = require('express');
var router = express.Router();


module.exports = function(io, db) {
  // Routing
  router.route('/')
    .get(GETapiGuide);

  router.route('/bobs')
    .get(GETallBobs)
    .post(POSTcreateNewBob);

  router.route('/bobs/:bobid')
    .get(GETbob)
    .post(POSTplusOne)
    .put(PUTbob)
    .delete(ensureAuthenticated, DELETEbob);

  router.route('/bobs/:bobid/votes')

  router.route('/flavors')
    .get(GETflavors);

  router.route('/flavors/:flavorname')
    .get(GETflavor);

  router.route('/tags')
    .get(GETtags);

  router.route('/tags/:tagid')
    .get(GETtag);


  // API functions
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
    db.Bob.getActiveBobs().then(function(bobs) {
      res.send(bobs);
    });
  }

  function GETallBobs(req, res) {
    db.Bob.getBobs().then(function(bobs) {
      res.send(bobs);
    });
  }

  function POSTcreateNewBob(req, res, next) {
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

    // Save bob in db
    db.Bob.saveBob(bob).then(function success(bobData) {
      // Send to all boards
      io.emit('add_element', bobData);
      res.send("success");
    }, function error(err) {
      res.status(500).send(err);
    });
  }

  // Sends back one bob by id
  function GETbob(req, res) {
    db.Bob.getOneBob({ _id: db.ObjectId(req.params.bobid) } ).then(function success(data) {
      res.send(data);
    }, function error(err) {
      res.status(500).send(err);
    });
  }

  function POSTplusOne(req, res) {
    if (req.headers['plus-one']){
      db.Bob.plusOneBob(db.ObjectId(req.params.bobid)).then(function success(data) {
        res.send(data);
      }, function error(err) {
        res.status(500).send(err);
      });
    } else {
      res.status()
    }


  }

  // Updates an existing bob
  function PUTbob(req, res) {
    var bob = {
      _id:			 db.ObjectId(req.body.id),    // Used for identifying bob in db.Bob.updateBob
      data:      req.body.data,
      flavor:    req.body.flavor,             // Is not updated in db.Bob.updateBob
      startDate: req.body.startDate,
      endDate:   req.body.endDate,
      tags:      req.body.tags
    };

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
    db.Flavors.getFlavors().then(function success(data) {
	    res.send(data);
	  }, function error(err) {
	    res.status(500).send(err);
	  });
  }

  // Get one flavor by name or id
  function GETflavor(req, res) {
    db.Flavors.getFlavor({ name: req.params.flavorname }).then(function success(data) {
      // ObjectId is 24 characters long. If nothing is found by name, check by _id
      if(data === null && req.params.flavorname.length == 24){
        db.Flavors.getFlavor({ _id: db.ObjectId(req.params.flavorname) }).then(function success(data) {
          res.send(data);
        }, function error(err) {
    	    res.status(500).send(err);
        });
      } else {
        res.send(data);
      }
	  }, function error(err) {
	    res.status(500).send(err);
	  });
  }

  function GETtags(req, res) {
	  db.Tag.getTags().then(function success(data) {
	    res.send(data);
	  }, function error(err) {
	    res.status(500).send(err);
	  });
	}

  function GETtag(req, res) {
	  db.Tag.getTag({ _id: db.ObjectId(req.params.tagid) }).then(function success(data) {
	    res.send(data);
	  }, function error(err) {
	    res.status(500).send(err);
	  });
  }

  return router;
};
