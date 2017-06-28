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
    $('#slideshow').removeClass('initialized')
  }
  //reinit the carousel
  $('#slideshow').carousel({fullWidth: true});
}

function createBoardElement(bob) {
  
  var $html = $('<div>', {id: bob.id, class: "carousel-item"});
  switch (bob.flavor) {
    case 'Quote':
      $html.addClass('quote-bobble')
        .append($('<p>', {class: "quote", text: bob.data.Text}))
        .append($('<p>', {class: "author", text: bob.data.Author}));
      break;

    case 'Text':
      $html.addClass('text-bobble')
        .append($('<p>', {text: bob.data.Text}));
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

$(function() {
  setInterval(function() {
    $('#slideshow').carousel('next');
  }, 5000);
  // $.get('/flavors', function(res) {});

  // var $info = $('.info-block');
  // for (let i=0; i<10; i++) {
  //   $('#sidebar').append($info.clone());
  // }
})

var socket = io();
socket.emit('connection');

socket.on('all_elements', popluateBoard);
socket.on('add_element', addBoardElement);

console.log('board.js is running');