
### Table of Contents
* [Current Status](#status)
  * [License](#license)
  * [Future Work](#future-work)
  * [Credits](#credits)
* [Make Your Own](#make-your-own)
  * [Setup](#setup)
  * [Development](#development)
* [Contributing](#contributing)
  * [To-do and Bugs](#to-do)
* [Operating](#operating)
* [Directory Structure](#directory-structure)
* [API](#api)

## Status
FUTUREboard (repo name needs to be changed) is currently a slideshow of images, GIFs and text data supplemented by information about events happening on campus.

### License
This project is licensed under the MIT License, a ["short and simple permissive license with conditions only requiring preservation of copyright and license notices."](https://github.com/olinlibrary/FORWARDboard/blob/master/LICENSE)

### Future Work
* Integrate with A.B.E. to get event data
* Commenting on content
* Rooms for different content on different screens and/or privacy associated with posts
* Scaling
* Physical interactions with board (buttons or otherwise)

### Credits
This project is a product of Software of Summer 2017! Thank you to Jeff and Oliver for ongoing mentorship and to the fellow students for feedback and support. Also a big thanks to the participants of the first ever Library Potluck who interacted with the board and gave feedback.

## Make Your Own
### Setup
To install your own version of FUTUREboard: fork this repo, clone it so you have local access, enter the directory (`cd FORWARDboard`) and then run `npm install`. This project was deployed with [Heroku](https://heroku.com) using a Mongo database hosted by [mLab](https://mlab.com/). The texting interface was implemented using [Twilio](https://www.twilio.com/), so if you'd like to run your own version of the site, you'll need to make an account with each of these services (except mLab if you create a mongo instance through Heroku). As a heads up, Twilio costs $1 per phone number and $0.0075 per SMS sent or received, for MMS it's $0.01 to receive and $0.02 to send.

Once you have accounts with these services, you'll need a phone number from Twilio that can handle SMS/MMS and a free mLab instance (sandbox). Our app is set to access these services using keys stored as environment variables. You'll need to run the following code with each variable replaced with your real key.

```
export MONGODB_URI="<Get this from mLab instance>";
export TWILIO_ACCOUNT_SID="<Get this from Twilio dashboard>";
export TWILIO_AUTH_TOKEN="<Get this from Twilio dashboard>";
```

Once you've set these environment variables, you should be able to run the app locally by executing `npm start` (which runs `node server.js` as specified in `package.json`) from the root of the repo directory. This will serve the app at [http://localhost:8080](http://localhost:8080) unless your `PORT` environment variable is set to a different number.

NOTE: You'll need to [add these as environment variables to your Heroku instance](https://devcenter.heroku.com/articles/heroku-local#set-up-your-local-environment-variables) as well. Depending on your setup, you may want to have a separate database for local vs. production, but for just getting the app running it's not a crime to use the same.

Now that you've got these variables set, you need to get the [Heroku toolbelt](https://devcenter.heroku.com/articles/getting-started-with-nodejs#set-up) set up. Once logged in through the command line interface, run `heroku git:remote -a <YOUR PROJECT NAME>`. Now when you've committed changes to Github, you can [push to Heroku](https://devcenter.heroku.com/articles/getting-started-with-nodejs#push-local-changes) by running `git push heroku master`. If everything was done correctly, your app should deploy and you can access it at `<YOUR PROJECT NAME>.herokuapp.com`.

### Development
A tricky part about working with Twilio is that you need a publicly accessible URL for them to send texts to, so you need to have some form of staging server or tunneling software like Ngrok ([tutorial for using Ngrok with Twilio, it's pretty quick to get started!](https://www.twilio.com/blog/2013/10/test-your-webhooks-locally-with-ngrok.html)). The latter is recommended as it makes development more natural (test changes without new deployment) but is less permanent than a staging server managed by Heroku. A combination is ideal but extra work, that's all up to you!

As far as database administration, a pro of using mLab is having an interface for sifting through db records and doing general management rather than through the command line. Currently our app has a db admin interface so this functionality is less necessary.

## Contributing
To contribute, fork this repo and clone it to your local development environment. When making edits, make sure to base off of the `dev` branch by first running `git checkout dev` and ensuring that it's up to date with this repo `git pull upstream dev`. Once you're up to date, create a new branch off `dev` with `git checkout -b <branch_name>` and make any edits you'd like to make.

Once you've made the changes you'd like to make, ensure that they are committed to your new branch before switching back to dev to make sure it's fully up to date (another `git checkout dev` and `git pull upstream dev`). Once this is done, switch back to your branch (`git checkout <branch_name>`) and rebase onto dev with `git rebase -i dev`. This will ensure that any changes that have been made to `dev` are accounted for in your branch, thus avoiding any merge conflicts when we try to pull those changes into the main repo. To learn more about rebasing, look [here](https://help.github.com/articles/about-git-rebase/). If you've pushed your branch up to your version of the repo before rebasing, you will need to force push your rebased changes to your branch to ensure that the correct history is included for merging.

After all of that, go ahead and open a new pull request onto the upstream version of dev! This pull request should have a title describing the changes at a very high level and a description that gets into more details. These details should include what changes have been made and why. Then request that a contributor on the main repo review your code. Once suggestions have been made, make necessary edits and confirm once again that everything looks good. If yes, your reviewer can go ahead and merge it in!

### To do
* Integrate with A.B.E. to get event data
* Commenting on content
* Rooms for different content on different screens and/or privacy associated with posts
* Scaling
* Physical interactions with board (buttons or otherwise)
* Create better way to sync `flavors`

## Operating
First start the mongodb server:
`sudo service mongod start` or `mongod` (To restart, `sudo service mongod restart`)

Once you've setup your own version of the app, run `npm start` to get it running.

## Directory Structure
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

### /api/bobs/active
| HTTP Method | Action |
| ------------- | ------------- |
| GET | retrieve a list of active bobs (Date.now() is between date.start and date.end) |

### /api/bobs/bobid
| HTTP Method | Action |
| ------------- | ------------- |
| GET | retrieve bob object with id bobid |
| PUT | update the bob object |
| DELETE | delete the bob object |

### /api/flavors
| HTTP Method | Action |
| ------------- | ------------- |
| GET | retrieve all flavors |
| ~POST~ | create a new flavor object |

### /api/flavors/[flavorID : flavorName]
| HTTP Method | Action |
| ------------- | ------------- |
| GET | retrieve a flavor object by name or id |
| ~PUT~ | update the flavor object |


## Sockets
| Socket Name | Input | Method |
| ---  | --- | --- |
| 'add_element' | bob object | Create a new bob |
| 'update_element' | bob object | Update the bob with the same bobid |
| 'upvote' | { id: bobid, votes: num_votes } | Set bob with id bobid to num_votes |
| 'delete' | bobid | remove bob immediately |
