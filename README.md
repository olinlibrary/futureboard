# FUTUREboard

FUTUREboard is a digital signage platform for sharing of media – including
images, GIFs, and videos — supplemented by information about events happening on
campus.

## Table of Contents

- [Status](#status)
  - [To Do](#to-do)
    - [Top Priorities](#top-priorities)
    - [And MORE!](#and-more)
    - [Possible Extensions](#possible-extensions)
- [Make Your Own](#make-your-own)
  - [Setup](#setup)
  - [Development](#development)
  - [Database](#database)
- [Contributing](#contributing)
- [Operating](#operating)
- [Directory Structure](#directory-structure)
- [API](#api)
  - [/api/](#api)
  - [/api/bobs](#apibobs)
  - [/api/bobs/active](#apibobsactive)
  - [/api/bobs/[bobId]](#apibobsbobid)
  - [/api/bobs/[bobId]/votes](#apibobsbobidvotes)
  - [/api/bobs/[bobId]/flags](#apibobsbobidflags)
  - [/api/flavors](#apiflavors)
  - [/api/flavors/[flavorID : flavorName]](#apiflavorsflavorid-flavorname)
  - [/api/tags](#apitags)
  - [/api/tags/[tagID]](#apitagstagid)
  - [Socket.io](#socketio)
- [Notes on AWS](#notes-on-aws)
  - [Credits](#credits)
- [License](#license)

## Status

### To Do

#### Top Priorities

* [ ] Create Easy Means of Setting up Local Environment for frontend
* [ ] Setup Dev branch for continuous integration
* [x] Server-side resizing images and videos, EXIF-orientation fix, creating thumbnails of originals
* [ ] Edit Bob page
* [ ] Unit Testing, Test-driven development
* [x] Authentication
* [ ] Rooms for different content on different screens and/or privacy associated with posts
* [x] Administration Page / "Who is moderating?"
* [ ] Logistics, Setup procedures
* [ ] Open a feedback channel / Encourage new pull requests!

#### And MORE!

* [ ] Integrate with A.B.E. to get event data (add socket emit or push notifications for new events)
* [ ] Commenting/Threading/Replying on contents
* [ ] Smoother Touch Swipe
* [ ] Support more views & clean up css (bobbles, Pinterest-like UI)
* [x] Favicon
* [ ] Better autoscroll / display of events
* [ ] Replace Materialize carousel - seek alternatives or make your own for better performance & extendability

#### Possible Extensions

* Commenting/Threading on content
* Rooms for different content on different screens and/or privacy associated with posts
* Scaling
* Physical interactions with board (buttons or otherwise)
* Get push notifications (socket) from ABE (talk to the ABE team)

## Make Your Own

### Setup

To install your own version of FUTUREboard: fork this repo, clone it so you have local access, enter the directory (`cd FORWARDboard`) and then run `npm install`, which will automatically install the npm modules listed in package.json. This project was deployed with [Heroku](https://heroku.com) using a Mongo database hosted by [mLab](https://mlab.com/). Our app is set to access the external services using keys stored as environment variables. You'll need to run the following code with each variable replaced with your real key.

```shell
export MONGODB_URI="<Get this from mLab instance>";
```

Optionally set the `ADMIN_PASSWORD` to something. If you do not set it, then there will be no auth on the admin page.

By default, the app uses the staging instance of ABE. In the future, this will
only be accessible with authentication, or from within the Olin LAN. To use a
local ABE instance:

1. Follow the instructions [here](https://github.com/olinlibrary/ABE#readme) to
   run the local ABE server.
2. Set the `ABE_API_URI` environment variable to `http://localhost:3000`.

Once you've set these environment variables, you should be able to run the app
locally by executing `npm start` from the root of the repo directory. (This runs
`node server.js`, as specified in `package.json`). This will serve the app at
<http://localhost:8080>.

NOTE: You'll need to [add these as environment variables to your Heroku instance](https://devcenter.heroku.com/articles/heroku-local#set-up-your-local-environment-variables) as well. Depending on your setup, you may want to have a separate database for local vs. production, but for just getting the app running it's not a crime to use the same.

Setting up AWS: We use AWS S3 to store media, and have AWS Lambda functions to resize images and transcode video.

We used [aws-lambda-ffmpeg](https://github.com/binoculars/aws-lambda-ffmpeg) and [aws-lambda-image](https://github.com/ysugimoto/aws-lambda-image) for resizing the media. Install aws-lambda-ffmpeg first, because its installer fails if you try to use existing buckets. You can also install it with temporary buckets and then change the settings in the aws console. Create two buckets, an 'upload' bucket and a 'media' bucket. Users will upload to the 'upload' bucket, triggering a lambda function to process the file and save it to your 'media' bucket. Currently, images are prepended with 'img-' and video is with 'vid-' to differentiate lambda triggers. Create AWS keys for your app and set the following environment variables:

```shell
export ACCESS_KEY_ID=your access_key_id
export SECRET_ACCESS_KEY=your secret_access_key
```

Finally set up the 'media' bucket to publish to an SNS topic on ObjectCreate, and create an HTTPS subscription to *url*`/aws/MediaStatusSNS`. You will have to confirm this once you spin up the heroku instance.

Now that you've got these variables set, you need to get the [Heroku toolbelt](https://devcenter.heroku.com/articles/getting-started-with-nodejs#set-up) set up. Once logged in through the command line interface, run `heroku git:remote -a <YOUR PROJECT NAME>`. Now when you've committed changes to Github, you can [push to Heroku](https://devcenter.heroku.com/articles/getting-started-with-nodejs#push-local-changes) by running `git push heroku master`. If everything was done correctly, your app should deploy and you can access it at `<YOUR PROJECT NAME>.herokuapp.com`.

### Development

A tricky part about working with external services on your local server is that you need a publicly accessible URL for them to send packets to, so you need to have some form of staging server or tunneling software like Ngrok ([tutorial for using Ngrok with Twilio, it's pretty quick to get started!](https://www.twilio.com/blog/2013/10/test-your-webhooks-locally-with-ngrok.html)). The latter is recommended as it makes development more natural (test changes without new deployment) but is less permanent than a staging server managed by Heroku. A combination is ideal but extra work, that's all up to you!

As far as database administration, a pro of using mLab is having an interface for sifting through db records and doing general management rather than through the command line. Currently our app has a db admin interface so this functionality is less necessary.

### Database

It is very likely that your local server will be running with a local MongoDB.

To export the online mLab database: navigate to `/scripts`; then run the bash script [importDB.sh](./scripts/importDB.sh) with three input arguments listed below.

```shell
# To Run:
# sh importDB.sh <db_username> <db_password> <local_db_name>

# Export remote database for local import.
# Get username and password from Heroku mLab instance - environment variables in settings.
mongodump -h ds113063.mlab.com:13063 -d heroku_w45g6cd6 -u $1 -p $2 -o mLabDump;
# You can find your db_password in :
# heroku > settings > Reveal Config Vars -> MONGODB_URI -> Edit
   -> COPY and PASTE the string between ':' and '@'

# Replace database with files exported from remote using `exportRemote.sh`
mongorestore --drop -d $3 mLabDump/heroku_w45g6cd6;
```

## Contributing

To contribute, fork this repo and clone it to your local development environment. When making edits, make sure to base off of the `dev` branch by first running `git checkout dev` and ensuring that it's up to date with this repo `git pull upstream dev`. Once you're up to date, create a new branch off `dev` with `git checkout -b <branch_name>` and make any edits you'd like to make.

Run `npm run lint` to verify your code formatting.

Once you've made the changes you'd like to make, ensure that they are committed to your new branch before switching back to dev to make sure it's fully up to date (another `git checkout dev` and `git pull upstream dev`). Once this is done, switch back to your branch (`git checkout <branch_name>`) and rebase onto dev with `git rebase -i dev`. This will ensure that any changes that have been made to `dev` are accounted for in your branch, thus avoiding any merge conflicts when we try to pull those changes into the main repo. To learn more about rebasing, look [here](https://help.github.com/articles/about-git-rebase/). If you've pushed your branch up to your version of the repo before rebasing, you will need to force push your rebased changes to your branch to ensure that the correct history is included for merging.

After all of that, go ahead and open a new pull request onto the upstream version of dev! This pull request should have a title describing the changes at a very high level and a description that gets into more details. These details should include what changes have been made and why. Then request that a contributor on the main repo review your code. Once suggestions have been made, make necessary edits and confirm once again that everything looks good. If yes, your reviewer can go ahead and merge it in!

## Operating

First start the mongodb server:
`sudo service mongod start` or `mongod`.
(To restart, `sudo service mongod restart`.)

Set environment variables for AWS:

```shell
export ACCESS_KEY_ID=
export SECRET_ACCESS_KEY=
```

Once you've set up your own version of the app, run `npm start` to get it running.

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
  * [api.js](./routes/api.js) : Routes for API
  * [awsapi.js](./routes/awsapi.js) : Routes/Configuration for aws services
  * [browser.js](./routes/browser.js) : Routes for rendering templates/views
  * [httpredirect.js](./routes/httpredirect.js) :
  * [sockets.js](./routes/sockets.js) : socket.io routes
  * ![#5d646b](https://placehold.it/15/5d646b/000000?text=+)[twilio.js](./routes/twilio.js) :twilio(MMS service) routes
* ![#f03c15](https://placehold.it/15/f03c15/000000?text=+)
  [scripts](./scripts) : custom node.js scripts for mongoDB
  * [exportDB.js](./scripts/exportDB.js) : exports current mongoDB into JSON
  * [importDB.js](./scripts/importDB.js) : imports JSON into current mongoDB
  * [importDB.sh](./scripts/importDB.sh) : bash script that imports the online mLAB db
* ![#5d646b](https://placehold.it/15/5d646b/000000?text=+)
  [physicalInterface](./physicalInterface) : Arduino Physical Controller Inteface
  * [CapacitiveSensorSketch.ino](./physicalInterface/CapacitiveSensorSketch.ino)
  * [serialController.js](./physicalInterface/serialController.js)
* ![#c5f015](https://placehold.it/15/c5f015/000000?text=+)
  [templates](./templates) : html templates for pages
  * [admin.html](./templates/admin.html)
  * [api.html](./templates/api.html)
  * [views.html](./templates/views.html) : display all available views
  * [board.html](./templates/board.html) : standard board view
  * [events.html](./templates/events.html) : events only page for dual screens
  * [stream.html](./templates/stream.html) : stream only page for dual screens
  * [landing.html](./templates/landing.html) : default page for root URL
  * [uploadfile.html](./templates/uploadfile.html) : main input channel template
  * ![#5d646b](https://placehold.it/15/5d646b/000000?text=+) [controller.html](./templates/controller.html)
  * ![#5d646b](https://placehold.it/15/5d646b/000000?text=+) [editbob.html](./templates/editbob.html)
* ![#c5f015](https://placehold.it/15/c5f015/000000?text=+)
  [static](./static)
  * ![#1589F0](https://placehold.it/15/1589F0/000000?text=+)
    [vendor](./static/vendor)
    * [socket.io.js](./static/vendor/socket.io.js)
    * [jquery.min.js](./static/vendor/jquery.min.js)
    * [date.min.js](./static/vendor/date.min.js) : date parser
    * [dropzone.min.js](./static/vendor/dropzone.js) : upload UI
    * [dropzone.css](./static/vendor/dropzone.css)
    * [materialize.min.js](./static/vendor/materialize.min.js)
    * [materialize.min.css](./static/vendor/materialize.min.css) : Materialize Framework for css
    * [showdown.min.js](./static/vendor/showdown.min.js) : Markdown Parser
  * ![#c5f015](https://placehold.it/15/c5f015/000000?text=+)
    [css](./static/css)
    * fonts files (DINOT)
    * [admin.css](./static/css/admin.css)
    * [board.css](./static/css/board.css)
    * [board_mobile.css](./static/css/board_mobile.css)
    * [landing.css](./static/css/landing.css)
    * [events-only.css](./static/css/events-only.css)
    * [stream-only.css](./static/css/stream-only.css)
    * [upload.css](./static/css/upload.css)
    * ![#5d646b](https://placehold.it/15/5d646b/000000?text=+) [controller.css](./templates/controller.css)
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

~Strikethrough~ indicates unimplemented functionality.

Note: Flagged bobs are never returned, except on `/bobs/flagged`.

### /api/

| HTTP Method | Action                      |
|-------------|-----------------------------|
| GET         | retrieve this documentation |

### /api/bobs

| HTTP Method | Action                      |
|-------------|-----------------------------|
| GET         | retrieve a list of all bobs |
| POST        | create a new bob object     |

### /api/bobs/active

| HTTP Method | Action                                                                             |
|-------------|------------------------------------------------------------------------------------|
| GET         | retrieve a list of active bobs (The definition of active is still extremely fluid) |

### /api/bobs/[bobId]

| HTTP Method | Action                                |
|-------------|---------------------------------------|
| GET         | retrieve bob object with id bobId     |
| PUT         | update the bob object                 |
| DELETE      | delete the bob object (Requires auth) |

### /api/bobs/[bobId]/votes

| HTTP Method | Action                                      |
|-------------|---------------------------------------------|
| GET         | retrieve number of votes bob with bobId has |
| POST        | add one up-vote to the bob                  |

### /api/bobs/[bobId]/flags

| HTTP Method | Action                     |
|-------------|----------------------------|
| GET         | retrieve flag value of bob |
| POST        | flag a bob                 |

### /api/flavors

| HTTP Method | Action                     |
|-------------|----------------------------|
| GET         | retrieve all flavors       |
| ~POST~      | create a new flavor object |

### /api/flavors/[flavorID : flavorName]

| HTTP Method | Action                                 |
|-------------|----------------------------------------|
| GET         | retrieve a flavor object by name or id |
| ~PUT~       | update the flavor object               |

### /api/tags

| HTTP Method | Action            |
|-------------|-------------------|
| GET         | retrieve all tags |
| ~POST~      | create a new tag  |

### /api/tags/[tagID]

| HTTP Method | Action                       |
|-------------|------------------------------|
| GET         | retrieve a tag by name or id |
| ~PUT~       | update the tag               |

### Socket.io

| Socket Name      | Input                             | Method                               |
|------------------|-----------------------------------|--------------------------------------|
| 'add_element'    | bob object                        | Create a new bob                     |
| 'update_element' | bob object                        | Update the bob with the same bob id  |
| 'upvote'         | `{ id: bobid, votes: num_votes }` | Set bob with id `bobid` to num_votes |
| 'delete'         | bob id                            | remove bob immediately               |

## Notes on AWS

We tried using AWS to handle media storage and transcoding, but in the future I would warn against this. We had set up two buckets - an upload bucket and a media bucket. Lambda functions were supposed to resize and transcode images and video into the media bucket, and then move the original files into a 'original/' folder in the media bucket. AWS is a big challenge, and we could not demo with this functionality because we ran into an error when adding triggers to the video transcoding lambda. Right now we use the source media on FUTUREboard, which does not work well on mobile and low power computers (like rasp pi). Google cloud allows transparent image resizing with url parameters ([docs](https://cloud.google.com/appengine/docs/standard/php/refdocs/classes/google.appengine.api.cloud_storage.CloudStorageTools#method_getImageServingUrl)). Alternatively, you can spin up a worker service on heroku to do all image and video resizing.

### Credits

This project is a product of Software of Summer 2017! Thank you to Jeff and Oliver for ongoing mentorship and to the fellow students for feedback and support. Also a big thanks to the participants of the first ever Library Potluck who interacted with the board and gave feedback.

## License

This project is licensed under the MIT License, a ["short and simple permissive license with conditions only requiring preservation of copyright and license notices."](https://github.com/olinlibrary/futureboard/blob/master/LICENSE)
