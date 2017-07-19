/**
 * Populates the board by creating jQuery DOM elements for given bobs,
 * Bobs with Meme flavor appended to memesStream (carousel),
 * Bobs with Moment flavor appeneded to momentsStream (carousel)
 * @param {Object[]} bobs - Array of Bob objects to be displayed on the board
*/
function popluateBoard(bobs) {
  let $momentsStream = $(".moments");
  let $slideShowButtons = (".slideshow-buttons");

  for (var i = 0; i < bobs.length; i++) {
    let bob = bobs[i];
    $momentsStream.append(createBoardElement(bob));
  }

  // Initalizes carousels for both moments and memes streams
  $momentsStream.carousel({
    fullWidth: true
  });
  // Initializes value for vote lable
  let activeBobID = $("#slideshow").find(".active").attr("id");
  updateVoteLabel(activeBobID);
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
        .append($('<video controls autoplay loop>').append($('<source>', {src:bob.data.Link})));
      break;

    case 'Moment':
      $html.addClass('image-bobble flip').attr("id", bob._id)
        .append($('<div />', {class: "image-holder front", css: {'background-image': "url(" + bob.data.Link + ")", 'background-size': "contain", 'background-position': "center top"}}))
        .append($('<div />', {class: "text-holder back"})
          .append($('<p>', {class: "author", text: bob.data.Title}))
          .append($('<p />', {class:"description", text : bob.data.Descrption})));
      break;

    case 'Meme':
      $html.addClass('image-bobble flip').attr("id", bob._id)
        .append($('<div />', {class: "image-holder front", css: {'background-image': "url(" + bob.data.Link + ")", 'background-size': "contain", 'background-position': "center top"}}))
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
 * Generates jQuery selector for a carousel depending on bob flavor,
 * then calls addToCarousel function, passing bob and carousel as params.
 * @param {Object} bob - A single Bob object received via socket
*/
function addBoardElement(bob) {
  carouselSelector = ".moments"; //jQuery selector for target carousel
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
  $carousel.carousel({
    fullWidth: true
  });
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
}

/**
  * Updates the label with the votes from bob with bobid
  * @param {string} bobid - id of the bob of the votes
*/
function updateVoteLabel(bobid){
  var $labelToUpdate = $("#votes");
  if(bobid != undefined){
    var votes =  $.get('/api/bobs/' + bobid + "/votes", function(res){
      $labelToUpdate.attr("data-badge-caption", "+" + res.votes);
    });
  }
}

/**
  * Updates the label with the votes returned from socket
  * parpm {object} res - response from the socekt which contains bobid and votes
*/
function incrementVote(res){
  $("#votes").attr("data-badge-caption", "+" + res.votes);
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
    $.get('/api/bobs', popluateBoard);
    carouselInterval = setInterval(function() {
      $('#slideshow').carousel('next');
    }, 12000);

    // DEFINIETELY NOT THE IDEAL WAY TO DO THIS (TEMPORARY)
    updateVoteLabelInterval= setInterval(function() {
      var activeBobID = $("#slideshow").find(".active").attr("id");
      updateVoteLabel(activeBobID);
    }, 100); // updates votes lable pretty often

    // BETTER WAY, BUT NOT WORKING PROPERLY at this point
    //  $(".carousel-item, .carousel")
    //   .on("carouselNext", "carouselPrev", "DOMContentLoaded", function(){
    //     console.log("change detected")
    //    var activeBobID = $("#slideshow").find(".active").attr("id");
    //    updateVoteLabel(activeBobID);
    //  });
    $(".plusOne").on("click touchstart", function(){
      var activeBobID = $("#slideshow").find(".active").attr("id");
      $.post('/api/bobs/' + activeBobID + "/votes");
    });
    $(".flag").on("click touchstart", function(){
      var activeBobID = $("#slideshow").find(".active").attr("id");
      $.post('/api/bobs/' + activeBobID + "/flags");
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
}

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
}

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
socket.on('update_element', updateBoardElement)
socket.on('upvote', incrementVote);
socket.on('delete', deleteElement)
