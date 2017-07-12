/**
 * Populates the board by creating jQuery DOM elements for given bobs,
 * Bobs with Meme flavor appended to memesStream (carousel),
 * Bobs with Moment flavor appeneded to momentsStream (carousel)
 * @param {Object[]} bobs - Array of Bob objects to be displayed on the board
*/
function popluateBoard(bobs) {
  let $momentsStream = $(".moments");
  let $memesStream = $(".memes");
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
 * Toggles the active item on the #slideshow carousel
*/
function toggleActiveItem(){
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
 * Swaps main/sub carousel elements by appending and removing their child items
*/

function swapCarousels() {
  let $momentStream = $('.moments');
  let $memeStream = $(".memes");
  let $momentActiveItem = $(".moments .carousel-item.active");
  let $memeActiveItem = $(".memes .carousel-item.active");
  let $momentNext = $momentActiveItem.nextAll();
  let $memeNext = $memeActiveItem.nextAll();
  let $momentBefore = $momentActiveItem.prevAll();
  let $memeBefore = $memeActiveItem.prevAll();

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
          .append($('<p />', {text : bob.data.Descrption})));
      break;

    case 'Meme':
      $html.addClass('image-bobble flip').attr("id", bob._id)
        .append($('<div />', {class: "image-holder front", css: {'background-image': "url(" + bob.data.Link + ")"}}))
        .append($('<div />', {class: "text-holder back"})
          .append($('<p>', {class: "author", text: bob.data.Title}))
          .append($('<p />', {text : bob.data.Descrption})));
      break;

    default:
      console.log("Unhandled type" + bob);
      $html = null;
  }

  return $html;
}

/**
 * Defines time interval for carousel auto slides,
 * Time Unit : ms.  Default Settings : 10s, 7s(small slide)
 */
var interval1 = null;
var interval2 = null;
$(function() {
  interval1 = setInterval(function() {
    $('#slideshow').carousel('next');
  }, 10000);
  interval2 = setInterval(function() {
    $('#slideshow-small').carousel('next');
  }, 7000);
});
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
    resetInterval(carouselControl("right"))
  }
  if (e.keyCode == 13) {
    // press enter key to swap carousels
    // Known Issue : holding the enter key deletes carousel child elements
    swapCarousels();
  }
});

function populateEvents(events_data) {
  // console.log(events_data);
  let $events_div = $('.events .collection');
  console.log(events_data.length);
  for (var i = 0; i < events_data.length - 1; i++) {
    $events_div.append(createEventObject(events_data[i]));
  }
}

function createEventObject(event_data) {
  var $html = $('<li>', {
    id: event_data.id,
    class: "collection-item avatar"
  })
    .append($('<span>', { class: 'title', text: event_data.title }))
    .append($('<p>', { class: 'date', text: event_data.start }))
    .append($('<p>', { class: 'description', text: event_data.description }));

  return $html;
}


$.get('https://abe.olin.build/events/', populateEvents);
$.get('/api/bobs', popluateBoard);

var socket = io();
socket.emit('connection');

socket.on('add_element', addBoardElement);
socket.on('manual_control', carouselControl);

console.log('board.js is running');
