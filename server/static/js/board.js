// masonry grid controller
$('.grid').masonry({
  itemSelector: '.grid-item',
  columnWidth: '.grid-sizer',
  gutter: '.gutter-sizer',
  percentPosition: true
});

function popluateBoard(bobbles) {
  var $bobbleList = $("#bobbles");
  for (var i = 0; i < bobbles.length; i++) {
    let $bob = $("<bob></bob>").addClass("grid-item")
      .attr('id', bobbles[i].value)
      .append(createBoardElement(bobbles[i]));
    $bobbleList.append($bob);
    // TODO: Bring randomization back in later
  }
}

function randomizeBobSize(bobID) {
  // randomly changes the size of the bob with bob_id
  var sizes = ["grid-item--width2", "grid-item--width3", "grid-item--height2",
    "grid-item--height3", "grid-item--height4"
  ];

  // this random feature is temporary
  var randIndex = Math.floor(Math.random() * sizes.length)
  $("#" + bobID).addClass(sizes[randIndex]);
}

function createBoardElement(bob) {
  switch (bob.flavor) {
    case 'Quote':
      $html = $('<p></p>')
        .append(bob.data.Text).append('<br>')
        .append(bob.data.Author);
      break;

    default:
      console.log("Unknown element type", bob.flavor);
      $html = null;
  }

  return $html;
}

function addBoardElement(newBob) {

  var $bobbleList = $("#bobbles")

  var id = newBob.value;
  var $bob = $("<bob></bob>").attr('id', id)
    .addClass("grid-item")
    .append(createBoardElement(newBob));

  //this id value needs to be relevant to the MongoDB id of newBob
  $bobbleList.append($bob);
  console.log(newBob.value + " Added to Board")
}

var socket = io();
socket.emit('connection');

socket.on('all_elements', popluateBoard);
socket.on('add_element', addBoardElement);


console.log('board.js is running');
