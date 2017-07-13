/**
 * Handles all routing and logic of the API
 * First half defines routing, the second half declares functions
*/


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

  router.route('/bobs/active')
    .get(GETallActiveBobs);

  router.route('/bobs/:bobid')
    .get(GETbob)
    .put(PUTbob)
    .delete(ensureAuthenticated, DELETEbob)
    .post(function(req, res) {
      res.status(405)
        .set('Access-Control-Allow-Methods', 'GET, PUT, DELETE')
        .send("error: cannot POST, use PUT to edit bobs");
    });

  router.route('/bobs/:bobid/votes')
    .get(GETvotes)
    .post(POSTupvoteBob);

  router.route('/bobs/:bobid/flags')
    .get(GETflag)
    .post(POSTflagBob);

  router.route('/flavors')
    .get(GETflavors);

  router.route('/flavors/:flavorname')
    .get(GETflavor);

  router.route('/tags')
    .get(GETtags);

  router.route('/tags/:tagid')
    .get(GETtag);


  // API functions
  /**
  * Checks for authentication.
  * Currently only checks for req.headers.auth, in the future it will use a more robust authentication method
  */
  function ensureAuthenticated(req, res, next) {
    if(req.headers.auth === 'hunter2'){
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

  function GETvotes(req, res) {
    db.Bob.getOneBob(db.ObjectId(req.params.bobid)).then(function success(data) {
      if(data){
        res.send({ votes: data.votes });
      } else {
        res.status(404).send("bob not found");
      }
    }, function error(err) {
      res.status(500).send(err);
    });
  }

  function POSTupvoteBob(req, res) {
    db.Bob.upvoteBob(db.ObjectId(req.params.bobid)).then(function success(data) {
      io.emit('upvote', { id:req.params.bobid, votes: data.votes + 1 });
      if(data){
        res.send("upvoted");
      } else {
        res.status(404).send("bob not found");
      }
    }, function error(err) {
      res.status(500).send(err);
    });
  }

  function GETflag(req, res) {
    db.Bob.getOneBob(db.ObjectId(req.params.bobid)).then(function success(data) {
      if(data){
        res.send({ flag: data.flag });
      } else {
        res.send("bob not found");
      }
    }, function error(err) {
      res.status(500).send(err);
    });
  }

  function POSTflagBob(req, res) {
    // console.log(req);
    console.log(req.params.bobid);
    db.Bob.flagBob(db.ObjectId(req.params.bobid)).then(function success(data) {
      console.log(data);
      if(data){
        console.log("sending socket")
        io.emit('delete', req.params.bobid);
        res.send("flagged");
      } else {
        console.log("searching for bob");
        db.Bob.getOneBob(db.ObjectId(req.params.bobid)).then(function success(data) {
          console.log(data);
          if(data){
            res.send({ flag: data.flag });
          } else {
            res.send("bob not found");
          }
        });
        // flagBob searches for bobId and flag: 0.
        // It returns null if the bob does not exist, or if has already been flagged
        // res.send("bob not found or already flagged");
      }
    }, function error(err) {
      res.status(500).send(err);
    });
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

    db.Bob.updateBob(bob).then(function success(data) {
      io.emit('update_element', data);
      res.send("update successful");
    }, function error(err) {
      res.status(500).send(err);
    });
  }

  // Delete a bob by id
  function DELETEbob(req, res) {
    db.Bob.deleteBob(db.ObjectId(req.params.bobid)).then(function success(data) {
      io.emit('delete_element', data);
      res.send("Success");
    }, function error(err) {
      res.status(500).send(err);
    });
  }

  // Get all flavors
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

  // Get all tags
  function GETtags(req, res) {
	  db.Tag.getTags().then(function success(data) {
	    res.send(data);
	  }, function error(err) {
	    res.status(500).send(err);
	  });
	}

  // Get a single tag by id
  function GETtag(req, res) {
	  db.Tag.getTag({ _id: db.ObjectId(req.params.tagid) }).then(function success(data) {
	    res.send(data);
	  }, function error(err) {
	    res.status(500).send(err);
	  });
  }

  router.GETallBobs = GETallBobs;
  return router;
};
