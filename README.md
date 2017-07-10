FUTUREboard
===

Run with:
---
`nodejs server.js`


Starting mongodb server:
`sudo service mongod start`
(To restart, `sudo service mongod restart`)


Add function to schema:
`Schema.methods.speak = function () {
  // Act
};`

## Directories

* [models](./models)
  * [bob.js](./models/bob.js)
  * [flavor.js](./models/flavor.js)
  * [tag.js](./models/tag.js)
  * [wrapper.js](./models/wrapper.js)
* [routes](./routes)
  * [controllerRoutes.js](./routes/controllerRoutes.js)
  * [sockets.js](./routes/sockets.js)
  * [twilio.js](./routes/twilio.js)
* [scripts](./scripts)
  * [bobs.json](./scripts/bobs.json)
  * [flavors.json](./scripts/flavors.json)
  * [tags.json](./scripts/tags.json)
  * [exportDB.js](./scripts/exportDB.js)
  * [importDB.js](./scripts/importDB.js)
  * [update field name.js](./scripts/update field name.js)
* [physicalInterface](./physicalInterface)
  * [CapacitiveSensorSketch.ino](./physicalInterface/CapacitiveSensorSketch.ino)
  * [serialController.js](./physicalInterface/serialController.js)
* [templates](./templates)
  * [admin.html](./templates/admin.html)
  * [board.html](./templates/board.html)
  * [controller.html](./templates/controller.html)
  * [editbob.html](./templates/editbob.html)
* [static](./static)
  * [vendor](./static/vendor)
    * [animatedModal.min.js](./static/vendor/animatedModal.min.js)
    * [jquery.min.js](./static/vendor/jquery.min.js)
    * [jquery.shapeshift.min.js](./static/vendor/jquery.shapeshift.min.js)
    * [jquery.touch-punch.min.js](./static/vendor/jquery.touch-punch.min.js)
    * [packery.pkgd.min.js](./static/vendor/packery.pkgd.min.js)
    * [socket.io.js](./static/vendor/socket.io.js)
  * [css](./static/css)
    * [admin.css](./static/css/admin.css)
    * [board.css](./static/css/board.css)
    * [controller.css](./static/css/controller.css)
    * [slideshow.css](./static/css/slideshow.css)
  * [js](./static/js)
    * [admin.js](./static/js/admin.js)
    * [board.js](./static/js/board.js)
    * [controller.js](./static/js/controller.js)
    * [editbob.js](./static/js/editbob.js)


* [package.json](./package.json)
* [server.js](./server.js)



## API
~Strikethrough~ indicates functionality not implemented yet

### /api/

| HTTP Method | Action |
| ------------- | ------------- |
| GET | retrieve this documentation |


### /api/bobs
| HTTP Method | Action |
| ------------- | ------------- |
| GET | retrieve a list of bobs |
| POST | create a new bob object |

### /api/bobs/bobID
| HTTP Method | Action |
| ------------- | ------------- |
| GET | retrieve bob object with id bobID |
| PUT | update the bob object |
| DELETE | delete the bob object |

### /api/flavors
| HTTP Method | Action |
| ------------- | ------------- |
| GET | retrieve all flavors |
| ~POST~ | create a new flavor object |

### /api/flavors/flavorID
| HTTP Method | Action |
| ------------- | ------------- |
| GET | retrieve a flavor object |
| ~PUT~ | update the flavor object |
