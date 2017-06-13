$('.grid').masonry({
  // set itemSelector so .grid-sizer is not used in layout
  itemSelector: '.grid-item',
  // use element for option
  columnWidth: '.grid-sizer',
  percentPosition: true
})

var bobbles = {};

function popluateBoard(bobbles) {
  console.log("populating board with", bobbles);
  var bobbles_list = $("#bobbles");
  for (var i = 0; i < bobbles.elements.length; i++) {
    var bob = $("<bob></bob>").addClass("grid-item")
    bob.append(createBoardElement(bobbles.elements[i]));
    bob.attr('id', bobbles.elements[i].value)
    bobbles_list.append(bob);
  }
}

// function changeBobSize(bob) {
//     var sizes = ["grid-item--width2", "grid-item--width3", "grid-item--height2",
//     "grid-item--height3", "grid-item--height4"];
//     var randindex = Math.floor(Math.random(sizes.lenght))
//     console.log(randindex)
//     $('bob').addClass(sizes[randindex]);
//     return console.log("size changes to : " + sizes[randindex])
// }

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
  bob.attr('id', new_bob.value);
  bobbles_list.append(bob);
  console.log(new_bob.value + "added")
}

var socket = io();
socket.emit('connection', 'board');

socket.on('all_elements', popluateBoard);
socket.on('add_element', addBoardElement);


console.log('board.js is running');
