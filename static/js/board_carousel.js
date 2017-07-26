/**
 * Populates the board by creating jQuery DOM elements for given bobs,
 * Bobs with Meme flavor appended to memesStream (carousel),
 * Bobs with Moment flavor appeneded to momentsStream (carousel)
 * @param {Object[]} bobs - Array of Bob objects to be displayed on the board
*/
function popluateBoard(bobs) {
  let $momentsStream = $(".moments");
  for (var i = 0; i < bobs.length; i++) {
    let bob = bobs[i];
    $momentsStream.append(createBoardElement(bob));
  }
  // Initalizes carousels for both moments and memes streams
  initCarousel();
}

function initCarousel(){
  let $momentsStream = $(".moments");
  $momentsStream.carousel({
    fullWidth: true,
    onCycleTo: function(activeItem){
      updateVoteLabel(activeItem);
      loadVideo(activeItem);
    }
  });
}
/**
 * Creates and Returns a new html element from a given Bob object
 * @param {Object} - Javascript Bob object from Mongoose
 * @return {Object} - jQuery html elment of the created Bob
 */
function createBoardElement(bob) {
  var $html = $('<div>', {
    id: bob.id,
    class: "carousel-item"
  });

  // Bob flavor decides how each bob is rendered
  switch (bob.flavor) {
    case 'Quote':
      $html.addClass('quote-bobble').attr("id", bob._id)
        .append($('<div>', {class: "quote-holder"})
          .append($('<p>', {class: "quote", text: bob.data.Text}))
          .append($('<p>', {class: "author", text: bob.data.Author}))
        );
      break;

    case 'Text':
      $html.addClass('text-bobble').attr("id", bob._id)
        .append($('<div>', {class: "text-holder"})
          .append($('<p>', {text: bob.data.Text}))
        );
      break;

    case 'Video':
      $html.addClass('video-bobble ').attr("id", bob._id)
        .append(($('<video loop muted poster>').attr("preload", "none").attr("poster", '/static/images/test-pump.gif'))
        .append($('<source>', {src:bob.data.Link})));
      break;

    case 'Moment':
      $html.addClass('image-bobble flip').attr("id", bob._id)
        .append($('<div />', {class: "image-holder front", css: {'background-image': "url(" + bob.data.Link + ")", 'image-orientation': '0deg', 'background-size': "contain", 'background-position': "center center"}}))
        .append($('<div />', {class: "text-holder back"})
          .append($('<p>', {class: "author", text: bob.data.Title})));
      break;

    case 'Meme':
      $html.addClass('image-bobble flip').attr("id", bob._id)
        .append($('<div />', {class: "image-holder front", css: {'background-image': "url(" + bob.data.Link + ")", 'image-orientation': '0deg', 'background-size': "contain", 'background-position': "center center"}}))
        .append($('<div />', {class: "text-holder back"})
          .append($('<p>', {class: "author", text: bob.data.Title})));
      break;

    default:
      console.log("Unhandled type" + bob);
      $html = null;
  }

  var description = bob.description || bob.data.Description;
  if (description !== undefined) {
    $html.append($('<div>', {class: "description"}).append(
      $('<p>', {text: description}))
    );
  }

  return $html;
}

/**
 * Generates jQuery selector for a carousel depending on bob flavor,
 * then calls addToCarousel function, passing bob and carousel as params.
 * @param {Object} bob - A single Bob object received via socket
*/
function addBoardElement(bob) {
  carouselSelector = ".moments"; //jQuery selector for target carousel
  if ($("#slideshow > div").length > 20) {
    $("#slideshow > div:last-child").remove();   // deletes the oldest bob
  }
  appendToCarousel(bob, carouselSelector);
}

/**
 * Creates a jQuery element of a new bob object,
 * then appends it to the target carousel DOM element
 * @param {Object} bob - A single Bob object to be added to the carousel
 * @param {string} carousel - jQuery selector string for the target carousel
*/
function appendToCarousel(bob, carouselSelector) {
  $carousel = $(carouselSelector);
  $activeItem = $(carouselSelector + " .carousel-item.active");
  if (bob !== null) {
    $activeItem.after(createBoardElement(bob));
  }
  var $before = $activeItem.prevAll();
  $carousel.append($before.clone());
  $before.remove();
  if ($carousel.hasClass('initialized')) {
    $carousel.removeClass('initialized');
  }
  //reinit the carousel
  initCarousel();
}

/**
  * Updates the caraousel item with updated bob data
  * Called when update_element socket received
  * @param {Object} bobData - contains updated bob data
*/
function updateBoardElement(bobData){
  var bobId = bobData._id;
  var $bobToUpdate = $("#" + bobId);
  var $imageHolder = $bobToUpdate.find(".image-holder");
  var newImage = "background-image: url(" + bobData.data.Link + ")";
  $imageHolder.attr("style", newImage);
  var $textHolder = $bobToUpdate.find(".text-holder");
  $textHolder.find(".author").attr("text", bobData.Title);
  $textHolder.find(".description").attr("text", bobData.Description);
}

/**
  * Deletes the html bob element with bobid from carousel
  * @param {string} bobid - id of the bob to be deleted
*/
function deleteElement(bobid){
  $("#" + bobid).remove();
  if ($('#slideshow').hasClass('initialized')) {
    $('#slideshow').removeClass('initialized');
  }
  // reinit the carousel
  initCarousel();
  // force move to next slide
  carouselControl("right");
}

/**
  * @param {object} activeItem - Vanilla JS Object of activeItem
  * Updates the label with the votes label for currently activeItem
*/
function updateVoteLabel(activeItem){
  var $labelToUpdate = $("#votes");
  var $activeBobID = $(activeItem).attr("id");
  var votes =  $.get('/api/bobs/' + $activeBobID + "/votes", function(res){
    $labelToUpdate.attr("data-badge-caption", "+" + res.votes);
  });
}

/**
  * Updates the label with the votes returned from socket
  * @param {object} res - response from the socket which contains bobid and votes
*/
function incrementVote(res){
  $("#votes").attr("data-badge-caption", "+" + res.votes);
}


/**
  * @param {object} activeItem - Vanilla JS Object of activeItem
  * Pauses the previous video, plays the current video, loads the next video
*/
function loadVideo(activeItem){
  var $activeItem = $(activeItem); // wrapping jQuery to vanilla JS Object
  if ($activeItem.hasClass("video-bobble")){
    $activeItem.find("video")[0].play();
  }
  if ($(".active").next().hasClass("video-bobble")){
    $(".active").next().find("video")[0].load();
  }
  if ($(".active").prev().hasClass("video-bobble")){
    $(".active").prev().find("video")[0].pause();
  }
}

/**
 * When Document is ready,
 * Defines time interval for carousel auto slides,
 * Listens on click and touch events for flip, swap buttons
 * Listens on click and touch events for plusOne, flag buttons
 * Listens on tab buttons for toggling the events
 * Time Unit : ms.  Default Settings : 10s, 7s(small slide)
 */

var carouselInterval = null;

$(function(){
    // initial interval setting
    $.get('/api/bobs/active', popluateBoard);
    carouselInterval = setInterval(function() {
      $('#slideshow').carousel('next');
    }, 12000);
    $(".plusOne").on("click", function(){
      var activeBobID = $("#slideshow").find(".active").attr("id");
      $.post('/api/bobs/' + activeBobID + "/votes");
    });
    $(".flag").on("click", function(){
      var activeBobID = $("#slideshow").find(".active").attr("id");
      $.post('/api/bobs/' + activeBobID + "/flags");
    });
    $.event.special.swipe.horizontalDistanceThreshold = (screen.availWidth) / 80;
    $('#slideshow').on("swipeleft", function(){
      $('#slideshow').stop();
      resetInterval(carouselControl("left"));
    });
    $('#slideshow').on("swiperight", function(){
      $('#slideshow').stop();
      resetInterval(carouselControl("right"));
    });
});

/**
 * Changes active item to either previous or next item depending on direction
 * @param {string} direction - direction of moving : left, right
 */
function carouselControl(direction){
  if (direction == "left") {
    $('#slideshow').carousel('prev', 1); // Move next n times.
  } else if (direction == "right") {
    $('#slideshow').carousel('next', 1); // Move next n times.
  }
};

/**
 * Resets time interval for the main carousel
 * Time Unit : ms.  Default Settings : 10s
 */
function resetInterval() {
  // Clears the existing timers
  clearInterval(carouselInterval);
  // Reinits the timers
  carouselInterval = setInterval(function() {
    $('#slideshow').carousel('next');
  }, 12000);
};

/**
 * Listens on jQuery events for keyboard controls
 * @param {event} e - jQuery event obejct
 */
$(document).keydown(function(e) {
  if (e.keyCode == 37) {
    // press left arrow key to go back to previous slide
    resetInterval(carouselControl("left"));
  }
  if (e.keyCode == 39) {
    // press right arrow key to go to next slide
    resetInterval(carouselControl("right"));
  }
});


var socket = io();

socket.on('add_element', addBoardElement);
socket.on('update_element', updateBoardElement);
socket.on('upvote', incrementVote);
socket.on('delete', deleteElement);
