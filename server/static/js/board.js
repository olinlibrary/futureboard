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
      case 'Text':
      case 'Quote':
        $(bob).addClass("grid-item--childwidth grid-item--text")
        break;
      case 'Poem':
        $(bob).addClass("grid-item--childwidth grid-item--poem")
        break;
      case 'Image':
        $(bob).addClass("grid-item--childwidth grid-item--image")
        break;
      case 'Meme':
        $(bob).addClass("grid-item--childwidth grid-item--meme")
        break;
      case 'Video':
        $(bob).addClass("grid-item--childwidth grid-item--video")
        break;
    }
  });
  console.log("bob size adjusted");
}

function createBoardElement(bob) {

  function buttonIcon(iconName){
    let newButton = $('<a></a>').attr('href', "#").addClass("--nomargin")
      .append($('<i></i>').addClass("material-icons tiny").append(iconName));
    return newButton;
  }

  let $bobNav = $('<div></div>').addClass("card-action card-action--thin right-align")
    .append(buttonIcon("thumb_up"))
    .append(buttonIcon("zoom_in"));

  function truncate(text, length){
    let shortText = text.substring(0, length);
    if (text.length > length){
      let readMore = '... <a href="#" class="text--small">More</a>'
      shortText += readMore;
    }
    return shortText;
  }
  switch (bob.flavor) {
    case 'Quote':
      $html = $('<div></div>').addClass("card white hoverable")
        .append($('<div></div>').addClass("card-content black-text")
          .append($('<p></p>').addClass("text--medium").append(truncate(bob.data.Text, 70)))
          .append($('<span></span>').addClass("text--small right").append("by ", bob.data.Author)))
        .append($bobNav);
      break;
    case 'Text':
      $html = $('<div></div>').addClass("card white hoverable")
        .append($('<div></div>').addClass("card-content black-text")
          .append(($('<p></p>')).addClass("flow-text-medium").append(truncate(bob.data.Text, 70))))
        .append($bobNav);
      break;
    case 'Poem':
      $html = $('<div></div>').addClass("card white hoverable")
        .append($('<div></div>').addClass("card-content black-text")
          .append($('<span></span>').addClass("card-title").append(bob.data.Title))
          .append($('<span></span>').addClass("right").append("by ", bob.data.Author)).append("<br>")
          .append($('<p></p>').addClass("text--small").append(truncate(bob.data.Text, 200))))
        .append($bobNav);
      break;
    case 'Image':
      $html = $('<div></div>').addClass("card white hoverable")
        .append($('<div></div>').addClass("card-image")
          .append($('<img></img>').addClass("responsive-img").attr('src', bob.data.Link)))
        .append($bobNav);
      break;
    case 'Meme':
      $html = $('<div></div>').addClass("card white hoverable")
        .append($('<span></span>').addClass("card-title").append(bob.data.Title))
        .append($('<div></div>').addClass("card-image")
          .append($('<img></img>').addClass("responsive-img").attr('src', bob.data.Link)))
        .append($('<div></div>').addClass("card-content black-text")
          .append(($('<p></p>')).addClass("flow-text-medium").append(truncate(bob.data.Description, 70))))
        .append($bobNav);
      break;
    case 'Video':
      $html = $('<div></div>').addClass("card white hoverable")
        .append($('<span></span>').addClass("card-title").append(bob.data.Title))
        .append($('<div></div>').addClass("video-container")
          .append($('<iframe></iframe>')
            .attr("allowfullscreen","true").attr("frameborder", 0).attr('width', 853).attr('height',480).attr('src', bob.data.Link)))
        .append($('<div></div>').addClass("card-content black-text")
          .append(($('<p></p>')).addClass("flow-text-medium").append(truncate(bob.data.Description, 70))))
        .append($bobNav);
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
