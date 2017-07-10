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


## Directory Tree
![#f03c15](https://placehold.it/15/f03c15/000000?text=+) `Backend`
![#c5f015](https://placehold.it/15/c5f015/000000?text=+) `Frontend`
![#1589F0](https://placehold.it/15/1589F0/000000?text=+) `Assets`
![#5d646b](https://placehold.it/15/5d646b/000000?text=+) `Deprecated`

* [node_modules]()
* ![#f03c15](https://placehold.it/15/f03c15/000000?text=+) [models](./models) : mongoDB Models
  * [bob.js](./models/bob.js)
  * [flavor.js](./models/flavor.js)
  * [tag.js](./models/tag.js)
  * [wrapper.js](./models/wrapper.js) : Wrapper for all models
* ![#f03c15](https://placehold.it/15/f03c15/000000?text=+)
[routes](./routes)
  * [controllerRoutes.js](./routes/controllerRoutes.js) : Express controller routes
  * [sockets.js](./routes/sockets.js) : socket.io routes
  * [twilio.js](./routes/twilio.js) : twilio(MMS service) routes
* ![#f03c15](https://placehold.it/15/f03c15/000000?text=+)
[scripts](./scripts) : custom node.js scripts for mongoDB
  * [bobs.json](./scripts/bobs.json) : bobs mongoDB collection in JSON
  * [flavors.json](./scripts/flavors.json) : flavors mongoDB collection in JSON
  * [tags.json](./scripts/tags.json) :tags mongoDB collection in JSON
  * [exportDB.js](./scripts/exportDB.js) : exports current mongoDB into JSON
  * [importDB.js](./scripts/importDB.js) : imports JSON into current mongoDB
  * [update_field_name.js](./scripts/update_field_name.js)
* ![#f03c15](https://placehold.it/15/f03c15/000000?text=+)
[physicalInterface](./physicalInterface) : Arduino Physical Controller Inteface
  * [CapacitiveSensorSketch.ino](./physicalInterface/CapacitiveSensorSketch.ino)
  * [serialController.js](./physicalInterface/serialController.js)
* ![#c5f015](https://placehold.it/15/c5f015/000000?text=+)
[templates](./templates) : html templates for pages
  * [admin.html](./templates/admin.html)
  * [board.html](./templates/board.html)
  * [controller.html](./templates/controller.html)
  * [editbob.html](./templates/editbob.html)
* ![#c5f015](https://placehold.it/15/c5f015/000000?text=+)
[static](./static)
  * ![#1589F0](https://placehold.it/15/1589F0/000000?text=+)
  [vendor](./static/vendor)
    * [socket.io.js](./static/vendor/socket.io.js)
    * [jquery.min.js](./static/vendor/jquery.min.js)
    * ![#5d646b](https://placehold.it/15/5d646b/000000?text=+) [animatedModal.min.js](./static/vendor/animatedModal.min.js) (deprecated, for draggble box UI)
    * ![#5d646b](https://placehold.it/15/5d646b/000000?text=+)  [jquery.shapeshift.min.js](./static/vendor/jquery.shapeshift.min.js) (deprecated, for draggble box UI)
    * ![#5d646b](https://placehold.it/15/5d646b/000000?text=+)  [jquery.touch-punch.min.js](./static/vendor/jquery.touch-punch.min.js) (deprecated, for draggble box UI)
    * ![#5d646b](https://placehold.it/15/5d646b/000000?text=+) [packery.pkgd.min.js](./static/vendor/packery.pkgd.min.js) (deprecated, for draggble box UI)
  * ![#c5f015](https://placehold.it/15/c5f015/000000?text=+)
  [css](./static/css)
    * [admin.css](./static/css/admin.css)
    * [controller.css](./static/css/controller.css)
    * [slideshow.css](./static/css/slideshow.css) : applied to board.html
    * ![#5d646b](https://placehold.it/15/5d646b/000000?text=+)
    [board.css](./static/css/board.css) (deprecated, for dragglble box UI)
  * ![#c5f015](https://placehold.it/15/c5f015/000000?text=+)
  [js](./static/js)
    * [admin.js](./static/js/admin.js)
    * [board.js](./static/js/board.js)
    * [controller.js](./static/js/controller.js)
    * [editbob.js](./static/js/editbob.js)


* ![#1589F0](https://placehold.it/15/1589F0/000000?text=+)
[package.json](./package.json) : npm module information
* ![#f03c15](https://placehold.it/15/f03c15/000000?text=+)
[server.js](./server.js) : contains server logics, run this to start node server



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
