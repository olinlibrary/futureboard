function popluateBoard(bobbles) {
  var $moments = $(".moments");
  var $memes = $(".memes");
  for (var i = 0; i < bobbles.length; i++) {
    let bob = bobbles[i];
    if (bob.flavor === "Moment") {
      $moments.append(createBoardElement(bob));
    } else if (bob.flavor === "Meme") {
      $memes.append(createBoardElement(bob));
    } else {
      //temporary(undecided), where to attach bobs that aren't memes or moments?
      $moments.append(createBoardElement(bob));
    }
  }
  $moments.carousel({
    fullWidth: true
  });
  $memes.carousel({
    fullWidth: true
  });
}

function addBoardElement(bob) {
  $carousel = null;
  if (bob.flavor === "Moment") {
    carousel = '.moments';
  } else if (bob.flavor === "Meme")
    carousel = '.memes';
  else {
    //temporary choice
    carousel = '.moments';
  }
  addToCarousel(bob, carousel);
}

function addToCarousel(bob, carousel) {
  $carousel = $(carousel);
  $activeItem = $(carousel + " .carousel-item.active");
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

// swap function called by swap button
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

  //reinit the carousels
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
  $momentStream.addClass("memes").removeClass("moments");
  $memeStream.addClass("moments").removeClass("memes");
}

function createBoardElement(bob) {
  var $html = $('<div>', {
    id: bob.id,
    class: "carousel-item"
  });
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

// Init Autoslide
$(function() {
  setInterval(function() {
    $('#slideshow').carousel('next');
  }, 10000);
  setInterval(function() {
    $('#slideshow-small').carousel('next');
  }, 7000);
});

function carouselControl(direction) {
  if (direction == "left") {
    $('#slideshow').carousel('prev', 1); // Move next n times.
  } else if (direction == "right") {
    $('#slideshow').carousel('next', 1); // Move next n times.
  }
}

//Keyboard Input Event Detection
$(document).keydown(function(e) {
  if (e.keyCode == 37) {
    //press left arrow key to go back to previous slide
    carouselControl("left");
  }
  if (e.keyCode == 39) {
    //press right arrow key to go to next slide
    carouselControl("right");
  }
  if (e.keyCode == 13) {
    //press enter key to swap carousels
    swapCarousels();
  }
});

var socket = io();
socket.emit('connection');

socket.on('all_elements', popluateBoard);
socket.on('add_element', addBoardElement);
socket.on('manual_control', carouselControl);

console.log('board.js is running');
