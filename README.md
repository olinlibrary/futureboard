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
