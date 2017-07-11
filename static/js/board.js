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
  }
  // Initalizes carousels for both moments and memes streams
  $momentsStream.carousel({
    fullWidth: true
  });
  $memesStream.carousel({
    fullWidth: true
  });
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
  if (bob != null) {
    $activeItem.after(createBoardElement(bob));
  }
  var $before = $activeItem.prevAll();
  $carousel.append($before.clone());
  $before.remove();

  if ($carousel.hasClass('initialized')) {
    $carousel.removeClass('initialized')
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

  $momentActiveItem.after($memeActiveItem.clone());
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
    $momentStream.removeClass('initialized')
  }
  if ($memeStream.hasClass('initialized')) {
    $memeStream.removeClass('initialized')
  }
  $momentStream.carousel({
    fullWidth: true
  });
  $memeStream.carousel({
    fullWidth: true
  });

  // Swaps the class attributes of the carousel DOM elements
  $momentStream.addClass("memes").removeClass("moments");
  $memeStream.addClass("moments").removeClass("memes");
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
      $html.addClass('image-bobble')
        .append($('<div />', {class: "image-holder", css: {'background-image': "url(" + bob.data.Link + ")"}}));
      break;

    case 'Meme':
      $html.addClass('image-bobble')
        .append($('<div />', {class: "image-holder", css: {'background-image': "url(" + bob.data.Link + ")"}}));
      break;

    default:
      console.log("Unhandled type" + bob);
      $html = null;
  }

  return $html;
}

/**
 * Defines time interval for carousel auto slides
 */
$(function() {
  setInterval(function() {
    $('#slideshow').carousel('next');
  }, 10000);
  setInterval(function() {
    $('#slideshow-small').carousel('next');
  }, 7000);
});

/**
 * Changes active item to either previous or next item depending on direction
 * @param {string} direction - direction of moving : left, right
 */
function carouselControl(direction) {
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
  if (e.keyCode == 37) {
    // press left arrow key to go back to previous slide
    carouselControl("left");
  }
  if (e.keyCode == 39) {
    // press right arrow key to go to next slide
    carouselControl("right");
  }
  if (e.keyCode == 13) {
    // press enter key to swap carousels
    // Known Issue : holding the enter key deletes carousel child elements
    swapCarousels();
  }
});

var socket = io();
socket.emit('connection');

socket.on('all_elements', popluateBoard);
socket.on('add_element', addBoardElement);
socket.on('manual_control', carouselControl);

console.log('board.js is running');
