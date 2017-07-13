/**
 * Populates the board by creating jQuery DOM elements for given bobs,
 * Bobs with Meme flavor appended to memesStream (carousel),
 * Bobs with Moment flavor appeneded to momentsStream (carousel)
 * @param {Object[]} bobs - Array of Bob objects to be displayed on the board
*/
function popluateBoard(bobs) {
  let $momentsStream = $(".moments");
  let $memesStream = $(".memes");
  let $slideShowButtons = (".slideshow-buttons");

  for (var i = 0; i < bobs.length; i++) {
    let bob = bobs[i];
    if (bob.flavor === "Moment") {
      $momentsStream.append(createBoardElement(bob));
    } else if (bob.flavor === "Meme") {
      $memesStream.append(createBoardElement(bob));
    } else {
      //temporary, appends bobs that aren't memes or moments to momentsStream
      $momentsStream.append(createBoardElement(bob));
    }
    initFlip("#" + bob._id);

  }
  // Initalizes carousels for both moments and memes streams
  $momentsStream.carousel({
    fullWidth: true
  });
  $memesStream.carousel({
    fullWidth: true
  });
  let activeBobID = $("#slideshow").find(".active").attr("id");
  updateVoteLabel(activeBobID);
}


/**
 * Initializes Flip instance using jQuery Flip plugin
 * @param {string} selector - jQuery selector for the html element to be flipped
*/
function initFlip(selector){
  $(selector).flip({
    trigger: 'manual'
  })
}

/**
 * Flips the active item on the #slideshow carousel
*/
function flipActiveItem(){
  $("#slideshow > .flip.active").flip('toggle');
}
/**
 * Generates jQuery selector for a carousel depending on bob flavor,
 * then calls addToCarousel function, passing bob and carousel as params.
 * @param {Object} bob - A single Bob object received via socket
*/
function addBoardElement(bob) {
  carouselSelector = null; //jQuery selector for target carousel
  if (bob.flavor === "Moment") {
    carouselSelector = '.moments';
  } else if (bob.flavor === "Meme")
    carouselSelector = '.memes';
  else {
    // Temporary choice
    carouselSelector = '.moments';
  }
  addToCarousel(bob, carouselSelector);
}

/**
 * Creates a jQuery element of a new bob object,
 * then appends it to the target carousel DOM element
 * @param {Object} bob - A single Bob object to be added to the carousel
 * @param {string} carousel - jQuery selector string for the target carousel
*/
function addToCarousel(bob, carouselSelector) {
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
  $carousel.carousel({
    fullWidth: true
  });
}

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
}

/**
 * Swaps main/sub carousel elements by appending and removing their child items
*/
function swapCarousels() {
  let $momentStream = $('.moments').not(".flip-button"); // don't swap flip-button!
  let $memeStream = $(".memes").not(".flip-button");
  let $momentActiveItem = $(".moments .carousel-item.active");
  let $memeActiveItem = $(".memes .carousel-item.active");
  let $momentNext = $momentActiveItem.nextAll();
  let $memeNext = $memeActiveItem.nextAll();
  let $momentBefore = $momentActiveItem.prevAll().not(".flip-button");
  let $memeBefore = $memeActiveItem.prevAll().not(".flip-button");

  $momentActiveItem.after($memeActiveItem.clone())
  $momentActiveItem.remove();
  $momentNext.remove();
  $momentStream.append($memeNext.clone());
  $momentStream.append($memeBefore.clone());

  $memeActiveItem.after($momentActiveItem.clone());
  $memeActiveItem.remove();
  $memeNext.remove();
  $memeStream.append($momentNext.clone());
  $memeStream.append($momentBefore.clone());

  $momentBefore.remove();
  $memeBefore.remove();

  // Reinit the carousels
  if ($momentStream.hasClass('initialized')) {
    $momentStream.removeClass('initialized');
  }
  if ($memeStream.hasClass('initialized')) {
    $memeStream.removeClass('initialized');
  }

  // Swaps the class attributes of the carousel DOM elements
  $momentStream.addClass("memes").removeClass("moments");
  $memeStream.addClass("moments").removeClass("memes");

  $momentStream.carousel({
    fullWidth: true
  });
  $memeStream.carousel({
    fullWidth: true
  });
  // Reinits jQuery flip instances for swapped items
  $(".flip").each(function(index){
    initFlip("#" + $(this).attr("id"));
  })
  resetInterval();
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
      $html.addClass('quote-bobble')
        .append($('<div>', {class: "quote-holder"})
          .append($('<p>', {class: "quote", text: bob.data.Text}))
          .append($('<p>', {class: "author", text: bob.data.Author}))
        );
      break;

    case 'Text':
      $html.addClass('text-bobble')
        .append($('<div>', {class: "text-holder"})
          .append($('<p>', {text: bob.data.Text}))
        );
      break;

    case 'Video':
      $html.addClass('video-bobble')
        .append('<iframe>', {
          width: "560",
          height: "315",
          src: bob.data.Link,
          frameborder: "0",
          allowfullscreen: ""
        });
      break;

    case 'Moment':
      $html.addClass('image-bobble flip').attr("id", bob._id)
        .append($('<div />', {class: "image-holder front", css: {'background-image': "url(" + bob.data.Link + ")"}}))
        .append($('<div />', {class: "text-holder back"})
          .append($('<p>', {class: "author", text: bob.data.Title}))
          .append($('<p />', {class:"description", text : bob.data.Descrption})));
      break;

    case 'Meme':
      $html.addClass('image-bobble flip').attr("id", bob._id)
        .append($('<div />', {class: "image-holder front", css: {'background-image': "url(" + bob.data.Link + ")"}}))
        .append($('<div />', {class: "text-holder back"})
          .append($('<p>', {class: "author", text: bob.data.Title}))
          .append($('<p />', {class:"description", text: bob.data.Descrption})));
      break;

    default:
      console.log("Unhandled type" + bob);
      $html = null;
  }
  return $html;
}

/**
  * Populates events element by creating and appending even items from ABE
  * @param {Object[]} eventsData - list of JSON events data
*/
function populateEvents(eventsData) {
  let $eventsToday = $('#eventsToday');
  let $eventsTomorrow = $('#eventsTomorrow');
  let $eventsThisWeek = $('#eventsThisWeek');
  for (var i = 0; i < eventsData.length - 1; i++) {
    let $newEvent = createEventObject(eventsData[i]);
    let eventStart = eventsData[i].start;
    let eventTime = new Date();
    // console.log(eventStart);
    switch(eventTime){
      case 'Today':
        $eventsToday.append($newEvent);
        $eventsThisWeek.append($newEvent);
        break;
      case 'Tomorrow':
        $eventsTomorrow.append($newEvent);
        $eventsThisWeek.append($newEvent);
        break;
      case 'ThisWeek':
        $eventsThisWeek.append($newEvent);
        break;
    }
    $eventsToday.append($newEvent);
    // $eventsThisWeek.append($newEvent);
  }
}

/**
  * Creates html element for an event parsed from ABE.com
  * @param {Object} eventData - A single JSON instance of ABE event
*/
function createEventObject(eventData) {
  var $html = $('<li>', {
    id: eventData.id,
    class: "collection-item"
  })
    .append($('<span>', { class: 'title', text: eventData.title }))
    .append($('<p>', { class: 'date', text: eventData.start }))
    .append($('<p>', { class: 'description', text: eventData.description }));
  return $html;
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
  var $bobToDelete = $("#" + bobid);
  $bobToDelete.remove();
}

/**
  * Updates the label with the votes from bob with bobid
  * @param {string} bobid - id of the bob of the votes
*/
function updateVoteLabel(bobid){
  var $labelToUpdate = $("#votes");
  var votes =  $.get('/api/bobs/' + bobid + "/votes", function(res){
    $labelToUpdate.attr("data-badge-caption", "+" + res.votes);
  });
}

/**
  * Updates the label with the votes returned from socket
  * parpm {object} res - response from the socekt which contains bobid and votes
*/
function incrementVote(res){
  var $labelToUpdate = $("#votes");
  $labelToUpdate.attr("data-badge-caption", "+" + res.votes);
}

/**
 * Reests time interval for the main carousel
 * Time Unit : ms.  Default Settings : 10s
 */
function resetInterval() {
  // Clears the existing timers
  clearInterval(interval1);
  // Reinits the timers
  interval1 = setInterval(function() {
    $('#slideshow').carousel('next');
  }, 10000);
}

/**
 * Listens on jQuery events for keyboard controls
 * @param {event} e - jQuery event obejct
 */
$(document).keydown(function(e) {
  allowed = false;
  if (e.keyCode == 37) {
    // press left arrow key to go back to previous slide
    resetInterval(carouselControl("left"));
  }
  if (e.keyCode == 39) {
    // press right arrow key to go to next slide
    resetInterval(carouselControl("right"));
  }
  if (e.keyCode == 13) {
    // press enter key to swap carousels
    // Known Issue : holding the enter key deletes carousel child elements
    swapCarousels();
  }
});


/**
 * When Document is ready,
 * Defines time interval for carousel auto slides,
 * Listens on click and touch events for flip, swap buttons
 * Listens on click and touch events for plusOne, flag buttons
 * Listens on tab buttons for toggling the events
 * Time Unit : ms.  Default Settings : 10s, 7s(small slide)
 */
var interval1 = null;
var interval2 = null;

$(function() {

  // Populates the board with bobs and events
  $.get('https://abe-read.herokuapp.com/events/', populateEvents);
  $.get('/api/bobs', popluateBoard);

  interval1 = setInterval(function() {
    $('#slideshow').carousel('next');
  }, 10000);
  interval2 = setInterval(function() {
    $('#slideshow-small').carousel('next');
  }, 7000);

   $(".active, .carousel-item, .carousel").on("carouselNext", function(){
      console.log("change detected")
     var activeBobID = $("#slideshow").find(".active").attr("id");
     updateVoteLabel(activeBobID);
   });
   $(".active, .carousel-item, .carousel").on("carouselPrev", function(){
      console.log("change detected")
     var activeBobID = $("#slideshow").find(".active").attr("id");
     updateVoteLabel(activeBobID);
   });
   $(".active, .carousel-item, .carousel").on("DOMContentLoaded", function(){
      console.log("change detected")
     var activeBobID = $("#slideshow").find(".active").attr("id");
     updateVoteLabel(activeBobID);
   });
   
   $(".flip-button").on("click touchstart", function(){
     flipActiveItem();
   });
   $(".swap-button, .swap-button-mobile").on("click", function(){
     swapCarousels();
   });
   $(".plusOne").on("click touchstart", function(){
     var activeBobID = $("#slideshow").find(".active").attr("id");
     $.post('/api/bobs/' + activeBobID + "/votes");
   });
   $(".flag").on("click touchstart", function(){
     var activeBobID = $("#slideshow").find(".active").attr("id");
     $.post('/api/bobs/' + activeBobID + "/flags");
   });
   $("#tabToday").on("click touchstart", function(){
     $("#eventsTomorrow").addClass("hide");
     $("#eventsThisWeek").addClass("hide");
     $("#eventsToday").removeClass("hide");
   });

   $("#tabTomorrow").on("click touchstart", function(){
     $("#eventsToday").addClass("hide");
     $("#eventsThisWeek").addClass("hide");
     $("#eventsTomorrow").removeClass("hide");
   });

   $("#tabThisWeek").on("click touchstart", function(){
     $("#eventsToday").addClass("hide");
     $("#eventsTomorrow").addClass("hide");
     $("#eventsThisWeek").removeClass("hide");
   });
});


// Socket configuration
var socket = io();
socket.emit('connection');

socket.on('add_element', addBoardElement);
socket.on('update_element', updateBoardElement)
socket.on('upvote', incrementVote);
socket.on('delete', deleteElement)
// socket.on('manual_control', carouselControl); // arduino control

console.log('board.js is running');
