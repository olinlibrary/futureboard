function addBoardElement(newBob) {
  let $bob = $("<bob></bob>")
    .attr('id', newBob._id).attr('flavor', newBob.flavor).addClass("grid-item")
    .append(createBoardElement(newBob));
  $("bobbles").append($bob);
  adjustBobSize();
  initModals();
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
  initModals();
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
function initModals(){
  let $bobs= $("bob");
  $.each($bobs, function(index, bob) {
    $modalLink =$("#link"+bob.id);
    $($modalLink).animatedModal({
      animatedIn:"zoomIn",
      animatedOut:"zoomOut",
      color:"#fbf3f2",
      modalTarget: "modal" + bob.id,
      beforeOpen: function() {
      },
      afterOpen: function() {
      },
      beforeClose: function() {
      },
      afterClose: function() {
      }
    })
  });
}


function createBoardElement(bob) {

  function buttonIcon(iconName){
    let newButton = $('<a></a>').attr('href', "#").addClass("--nomargin")
      .append($('<i></i>').addClass("material-icons tiny").append(iconName));
    return newButton;
  }
  function tagChips(bob){
    $chips = $("<div></div>").addClass("hide-on-small-only right-align");
    for (let i = 0; i < bob.tags.length; i++){
      $chip = $("<div></div>").addClass("chip").append("#", bob.tags[i]);
      $chips.append($chip);
    }
    return $chips;
  }
  function truncate(text, length){
    let shortText = text.substring(0, length);
    if (text.length > length){
      let readMore = '... <a href="#" class="text--small">More</a>'
      shortText += readMore;
    }
    return shortText;
  }

  function addFullScreenModal($element, bob){
    let modalLinkID = "link" + bob._id;
    let animatedModalID = "modal" + bob._id;

    let $zoomInButton = $('<a></a>')
      .attr('href', "#" + animatedModalID)
      .attr('id', modalLinkID)
      .addClass("--nomargin")
      .append($('<i></i>').addClass("material-icons tiny").append("zoom_in"));

    let $modalScreen = $('<div></div').attr("id", animatedModalID);

    let $closeDiv = $('<div></div')
                      .addClass("close-" + animatedModalID)
                      .attr("id", "btn-close-modal");
    let $closeIcon = $("<i></i>")
                    .addClass("waves-effect material-icons large")
                    .append('close');
    let $modalContentDiv = $('<div></div>').addClass("modal-content");

    let $modalContent = function modalContent(){
      switch (bob.flavor) {
        case 'Quote':
          $content = $('<div></div>').addClass("card white hoverable")
            .append($('<div></div>').addClass("card-content black-text")
              .append($('<p></p>').addClass("text--medium").append(truncate(bob.data.Text, 70)))
              .append($('<span></span>').addClass("text--small right").append("by ", bob.data.Author)))
          break;
        case 'Text':
          $content = $('<div></div>').addClass("card white hoverable")
            .append($('<div></div>').addClass("card-content black-text")
              .append(($('<p></p>')).addClass("flow-text-medium").append(truncate(bob.data.Text, 70))))
          break;
        case 'Poem':
          $content = $('<div></div>').addClass("card white hoverable")
            .append($('<div></div>').addClass("card-content black-text")
              .append($('<span></span>').addClass("card-title").append(bob.data.Title))
              .append($('<span></span>').addClass("right").append("by ", bob.data.Author)).append("<br>")
              .append($('<p></p>').addClass("text--small").append(truncate(bob.data.Text, 200))))

          break;
        case 'Image':
          $content = $('<div></div>').addClass("card white hoverable")
            .append($('<div></div>').addClass("card-image")
              .append($('<img></img>').addClass("responsive-img").attr('src', bob.data.Link)))

          break;
        case 'Meme':
          $content = $('<div></div>').addClass("card white hoverable")
            .append($('<span></span>').addClass("card-title").append(bob.data.Title))
            .append($('<div></div>').addClass("card-image")
              .append($('<img></img>').addClass("responsive-img").attr('src', bob.data.Link)))
            .append($('<div></div>').addClass("card-content black-text")
              .append(($('<p></p>')).addClass("flow-text-medium").append(truncate(bob.data.Description, 70))))

          break;
        case 'Video':
          $content = $('<div></div>').addClass("card white hoverable")
            .append($('<span></span>').addClass("card-title").append(bob.data.Title))
            .append($('<div></div>').addClass("video-container")
              .append($('<iframe></iframe>')
                .attr("allowfullscreen","true").attr("frameborder", 0).attr('width', 853).attr('height',480).attr('src', bob.data.Link)))
            .append($('<div></div>').addClass("card-content black-text")
              .append(($('<p></p>')).addClass("flow-text-medium").append(truncate(bob.data.Description, 70))))
          break;

        default:
          console.log("Unknown element type", bob.flavor);
          $content= null;
        }
        return $content;
    }

    $modalScreen = $modalScreen
      .append($closeDiv.append($closeIcon))
      .append($modalContentDiv.append($modalContent));
    $zoomInButton.appendTo($element);
    $modalScreen.appendTo($element);
  }


  let $bobNav =
  tagChips(bob)
  .append($('<div></div>').addClass("card-action card-action--thin right-align")
    .append(buttonIcon("thumb_up")));

  addFullScreenModal($bobNav.find(".card-action"), bob)

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
