function addBoardElement(newBob) {
  let $bob = $("<bob></bob>")
    .attr('id', newBob._id)
    .attr('flavor', newBob.flavor)
    .addClass("grid-item")
    .append(createBoardElement(newBob));

  //this id value needs to be relevant to the MongoDB id of newBob
  $bobbleList.append($bob);
  adjustBobSize();
}

function popluateBoard(bobbles) {
  var $bobbleList = $("#bobbles");
  for (let i = 0; i < bobbles.length; i++) {
    let $bob = $("<bob></bob>").addClass("grid-item")
      .attr('id', bobbles[i]._id)
      .attr('flavor', bobbles[i].flavor)
      .append(createBoardElement(bobbles[i]));
    $bobbleList.append($bob);
    // TODO: Bring randomization back in later
  }
  adjustBobSize();
}

function adjustBobSize() {
  // changes sizes of all bobs on the board based on their flavors

  let $bobs = $("bob");
  console.log($bobs)
  $.each($bobs, function(index, bob) {
    let bobFlavor = $(bob).attr("flavor");
    switch (bobFlavor) {
      case 'Quote':
        $(bob).addClass("grid-item--width1")
          .addClass("grid-item--height2");
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
      $html = $('<p></p>')
        .append(bob.data.Text).append('<br>')
        .append(bob.data.Author);
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
      console.log(bob.flavor)
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
// masonry grid controller
$('.grid').masonry({
  itemSelector: '.grid-item',
  columnWidth: '.grid-sizer',
  gutter: 10,
  percentPosition: true
});

var socket = io();
socket.emit('connection');

socket.on('all_elements', popluateBoard);
socket.on('add_element', addBoardElement);


console.log('board.js is running');
