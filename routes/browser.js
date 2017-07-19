const express = require('express');
var router = express.Router();

module.exports = function (api, rootDir) {
  router.route('/').get(function(req, res) {
    res.sendFile(rootDir + '/templates/board.html');
  });

  router.route('/views').get(function(req, res) {
    res.sendFile(rootDir + '/templates/views.html');
  });

  router.route('/views/board').get(function(req, res) {
    res.sendFile(rootDir + '/templates/board.html');
  });

  // Stream only View
  router.route('/views/stream').get(function(req, res) {
    res.sendFile(rootDir + '/templates/stream.html');
  });

  // Events only View
  router.route('/views/events').get(function(req, res) {
    res.sendFile(rootDir + '/templates/events.html');
  });

  router.route('/new').get(function(req, res) {
    res.sendFile(rootDir + '/templates/controller.html');
  });

  router.route('/upload').get(function (req, res) {
    res.sendFile(rootDir + '/templates/uploadfile.html');
  });

  router.route('/admin').get(function(req, res) {
    res.sendFile(rootDir + '/templates/admin.html');
  });

  router.route('/bobs').get(api.GETallBobs);

  // Show edit page on /bobs/:bobid
  router.route('/bobs/:bobid')
    .get(function(req, res) {
      if(req.params.bobid.length === 24){
        db.Bob.getOneBob({ _id: db.ObjectId(req.params.bobid)}).then(function success(data) {
          if(data){
            res.sendFile(path.join(rootDir, '/templates/editbob.html'));
          } else {
            res.status(404).send("bob not found");
          }
        }, function error(err) {
          console.log(err);
        });
      } else {
        res.status(404).send("bob id must be 24 characters long");
      }
    });

  return router;
}
