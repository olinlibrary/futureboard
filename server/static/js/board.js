// masonry grid controller
$('.grid').masonry({
  itemSelector: '.grid-item',
  columnWidth: '.grid-sizer',
  gutter: '.gutter-sizer',
  percentPosition: true
});

// var bobbles = {};

function popluateBoard(bobbles) {
  console.log("populating board with", bobbles);
  var bobbles_list = $("#bobbles");
  for (var i = 0; i < bobbles.elements.length; i++) {
    var bob = $("<bob></bob>").addClass("grid-item")
    bob.append(createBoardElement(bobbles.elements[i]));
    bob.attr('id', bobbles.elements[i].value)
    var id = bobbles.elements[i].value;
    // randomizeBobSize(id)
    bobbles_list.append(bob);
  }
}

function randomizeBobSize(bob_id) {
  // randomly changes the size of the bob with bob_id
  var sizes = ["grid-item--width2", "grid-item--width3", "grid-item--height2",
    "grid-item--height3", "grid-item--height4"
  ];

  // this random feature is temporary
  var randindex = Math.floor(Math.random() * sizes.length)

  var query = "#" + bob_id;

  $(query).addClass(sizes[randindex]);
  return console.log("size changes to : " + sizes[randindex])
}

function createBoardElement(bob) {

  switch (bob.type) {
    case 'text':
      html_element = document.createElement('p');
      html_element.innerHTML = bob.value;
      break;

    default:
      console.log("Unknown element type", bob.type);
      html_element = null;
  }

  return html_element;
}

function addBoardElement(new_bob) {

  var bobbles_list = $("#bobbles")
  var bob = $("<bob></bob>").addClass("grid-item")
  bob.append(createBoardElement(new_bob));

  //this id value needs to be relevant to the MongoDB id of new_bob
  var id = new_bob.value;
  bob.attr('id', id);
  bobbles_list.append(bob);
  console.log(new_bob.value + " Added to Board")
}

var socket = io();
socket.emit('connection', 'board');

socket.on('all_elements', popluateBoard);
socket.on('add_element', addBoardElement);


console.log('board.js is running');
