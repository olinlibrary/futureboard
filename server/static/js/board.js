function addBoardElement(newBob) {
  let $bob = $("<bob></bob>")
    .attr('id', newBob._id).attr('flavor', newBob.flavor).addClass("grid-item")
    .append(createBoardElement(newBob));
  $("bobbles").append($bob);
  adjustBobSize();
}

function popluateBoard(bobbles) {
  for (let i = 0; i < bobbles.length; i++) {
    let $bob = $("<bob></bob>").addClass("grid-item")
      .attr('id', bobbles[i]._id)
      .attr('flavor', bobbles[i].flavor)
      .append(createBoardElement(bobbles[i]));
    $("bobbles").append($bob);
  }
  adjustBobSize();
}

function adjustBobSize() {
  // changes sizes of all bobs on the board based on their flavors
  let $bobs = $("bob");
  $.each($bobs, function(index, bob) {
    let bobFlavor = $(bob).attr("flavor");
    switch (bobFlavor) {
      case 'Quote':
        $(bob).addClass("grid-item--childwidth")
        break;
      case 'Text':
        $(bob).addClass("grid-item--width1")
          .addClass("grid-item--height1");
        break;
        break;
      case 'Poem':
        $(bob).addClass("grid-item--width3")
          .addClass("grid-item--height4");
        break;
      case 'Image':
        $(bob).addClass("grid-item--childwidth")
          .addClass("grid-item--childheight");
        break;
      case 'Meme':
        $(bob).addClass("grid-item--childwidth")
          .addClass("grid-item--childheight");
        break;
      case 'Video':
        $(bob).addClass("grid-item--childwidth")
          .addClass("grid-item--childheight");
        break;
    }
  });
  console.log("bob size adjusted");
}

function createBoardElement(bob) {
  switch (bob.flavor) {
    case 'Quote':
      $html = $('<div></div>').addClass("card white")
        .append($('<div></div>').addClass("card-content black-text")
          .append($('<span></span>').addClass("card-title").append(bob.data.Text))
          .append($('<span></span>').addClass("right").append("by ", bob.data.Author)));
      break;
    case 'Text':
      $html = $('<p></p>')
        .append(bob.data.Text).append('<br>')
        .append(bob.data.Author);
      break;

    case 'Image':
      $html = $('<img></img>')
        .attr('src', bob.data.Link)
      break;

    case 'Video':
      $html = $('<embed></embed>')
        .attr('src', bob.data.Link);
      break;

    case 'Poem':
      $html = $('<p></p>')
        .append(bob.data.Title).append('<br>')
        .append(bob.data.Author).append('<br>')
        .append(bob.data.Text);
      break;

    case 'Meme':
      $html = $('<img></img>')
        .attr('src', bob.data.Link)
      break;

    default:
      console.log("Unknown element type", bob.flavor);
      $html = null;
  }
  return $html;
}


var socket = io();
socket.emit('connection');

socket.on('all_elements', popluateBoard);
socket.on('add_element', addBoardElement);

console.log('board.js is running');
