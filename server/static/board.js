
var board_elements = {};

function popluateBoard(board_elements) {
  console.log("populating board with", board_elements);

  var board_elements_list = document.getElementById('board_elements');

  for (var i = 0; i < board_elements.elements.length; i++) {
    var li = document.createElement("li");
    li.class = board_elements.elements[i].type;
    li.appendChild(createBoardElement(board_elements.elements[i]));

    board_elements_list.appendChild(li);
  }
}

function createBoardElement(board_element) {

  switch (board_element.type) {
    case 'text':
      html_element = document.createElement('p');
      html_element.innerHTML = board_element.value;
      break;

    default:
      console.log("Unknown element type", board_element.type);
      html_element = null;
  }

  return html_element;
}

function addBoardElement(new_element) {
  var board_elements_list = document.getElementById('board_elements');

  var li = document.createElement("li");
  li.class = new_element.type;
  li.appendChild(createBoardElement(new_element));

  board_elements_list.appendChild(li);
}

var socket = io();
socket.emit('connection', 'board');

socket.on('all_elements', popluateBoard);
socket.on('add_element', addBoardElement);


console.log('board.js is running');
