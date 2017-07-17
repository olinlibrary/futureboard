/*
Main Futureboard general JS components :
Contains socket configuration, listens on board controls,
Executes functions when document is ready(auto scroll, carousel interval).
*/

// Socket.io configuration
var socket = io();
socket.emit('connection');

socket.on('add_element', addBoardElement);
socket.on('update_element', updateBoardElement)
socket.on('upvote', incrementVote);
socket.on('delete', deleteElement)

console.log('board.js is running');

/**
 * When Document is ready,
 * Defines time interval for carousel auto slides,
 * Listens on click and touch events for flip, swap buttons
 * Listens on click and touch events for plusOne, flag buttons
 * Listens on tab buttons for toggling the events
 * Time Unit : ms.  Default Settings : 10s, 7s(small slide)
 */
var carouselInterval = null;

$(function() {

  // Populates the board with bobs and events
  $.get('https://abeweb.herokuapp.com/events/', populateEvents);
  $.get('/api/bobs', popluateBoard);

  carouselInterval = setInterval(function() {
    $('#slideshow').carousel('next');
  }, 10000);

  // DEFINIETELY NOT THE IDEAL WAY TO DO THIS (TEMPORARY)
  interval3 = setInterval(function() {
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

  // Initializes auto scroll for events
  var scrolltopbottom = setInterval(function(){
   $('.autoscrolling > .collection').animate({ scrollTop: $('.autoscrolling > .collection').height() }, 12000);
   setTimeout(function() {
      $('.autoscrolling > .collection').animate({scrollTop:0}, 8000);
   },4000);
 },4000);

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
  carouselInteral = setInterval(function() {
    $('#slideshow').carousel('next');
  }, 10000);
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
