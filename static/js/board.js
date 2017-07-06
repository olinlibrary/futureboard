function popluateBoard(bobbles) {
  var $bobbleList = $("#slideshow");
  for (var i = 0; i < bobbles.length; i++) {
    $bobbleList.append(createBoardElement(bobbles[i]));
  }
  $('#slideshow').carousel({fullWidth: true});
}

function addBoardElement(bob) {
  $('#slideshow .carousel-item.active').after(createBoardElement(bob));

  var $before = $('#slideshow .carousel-item.active').prevAll();
  $('#slideshow').append($before.clone());
  $before.remove();

  if ($('#slideshow').hasClass('initialized')) {
    $('#slideshow').removeClass('initialized');
  }
  //reinit the carousel
  $('#slideshow').carousel({fullWidth: true});
}

function createBoardElement(bob) {

  var $html = $('<div>', {id: bob.id, class: "carousel-item"});
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

    case 'Image':
      $html.addClass('image-bobble')
        .append($('<div />', {class: "image-holder", css: {'background-image': "url(" + bob.data.Link + ")"}}));
      break;

    default:
      console.log("Unhandled type" + bob);
      $html = null;
  }

  return $html;
}

function carouselControl(direction){
  if(direction == "left"){
      $('.carousel').carousel('prev', 1); // Move next n times.
  }
  else if(direction == "right"){
    $('.carousel').carousel('next', 1); // Move next n times.
  }
}

// Init autoslide
$(function() {
 setInterval(function() {
   $('#slideshow').carousel('next');
  }, 5000);
});

// Arrowkey control
$(document).keydown(function(e){
    if (e.keyCode == 37) {
       carouselControl("left");
    }
    if (e.keyCode == 39){
      carouselControl("right");
    }
});

var socket = io();
socket.emit('connection');

socket.on('all_elements'  , popluateBoard);
socket.on('add_element'   , addBoardElement);
socket.on('manual_control', carouselControl);

console.log('board.js is running');
