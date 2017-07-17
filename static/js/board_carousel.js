/**
 * Populates the board by creating jQuery DOM elements for given bobs,
 * Bobs with Meme flavor appended to memesStream (carousel),
 * Bobs with Moment flavor appeneded to momentsStream (carousel)
 * @param {Object[]} bobs - Array of Bob objects to be displayed on the board
*/
function popluateBoard(bobs) {
  let $momentsStream = $(".moments");
  let $slideShowButtons = (".slideshow-buttons");

  for (var i = 0; i < bobs.length; i++) {
    let bob = bobs[i];
    $momentsStream.append(createBoardElement(bob));
  }
  // Initalizes carousels for both moments and memes streams
  $momentsStream.carousel({
    fullWidth: true
  });

  // Initializes value for vote lable
  let activeBobID = $("#slideshow").find(".active").attr("id");
  updateVoteLabel(activeBobID);
}

/**
 * Generates jQuery selector for a carousel depending on bob flavor,
 * then calls addToCarousel function, passing bob and carousel as params.
 * @param {Object} bob - A single Bob object received via socket
*/
function addBoardElement(bob) {
  carouselSelector = null; //jQuery selector for target carousel
  if (bob.flavor === "Moment") {
    carouselSelector = '.moments';
  } else if (bob.flavor === "Meme")
    carouselSelector = '.memes';
  else {
    // Temporary choice
    carouselSelector = '.moments';
  }
  addToCarousel(bob, carouselSelector);
}

/**
 * Creates a jQuery element of a new bob object,
 * then appends it to the target carousel DOM element
 * @param {Object} bob - A single Bob object to be added to the carousel
 * @param {string} carousel - jQuery selector string for the target carousel
*/
function addToCarousel(bob, carouselSelector) {
  $carousel = $(carouselSelector);
  $activeItem = $(carouselSelector + " .carousel-item.active");
  if (bob !== null) {
    $activeItem.after(createBoardElement(bob));
  }
  var $before = $activeItem.prevAll();
  $carousel.append($before.clone());
  $before.remove();

  if ($carousel.hasClass('initialized')) {
    $carousel.removeClass('initialized');
  }
  //reinit the carousel
  $carousel.carousel({
    fullWidth: true
  });
}

/**
 * Changes active item to either previous or next item depending on direction
 * @param {string} direction - direction of moving : left, right
 */
function carouselControl(direction){
  if (direction == "left") {
    $('#slideshow').carousel('prev', 1); // Move next n times.
  } else if (direction == "right") {
    $('#slideshow').carousel('next', 1); // Move next n times.
  }
}

/**
  * Updates the caraousel item with updated bob data
  * Called when update_element socket received
  * @param {Object} bobData - contains updated bob data
*/
function updateBoardElement(bobData){
  var bobId = bobData._id;
  var $bobToUpdate = $("#" + bobId);
  var $imageHolder = $bobToUpdate.find(".image-holder");
  var newImage = "background-image: url(" + bobData.data.Link + ")";
  $imageHolder.attr("style", newImage);
  var $textHolder = $bobToUpdate.find(".text-holder");
  $textHolder.find(".author").attr("text", bobData.Title);
  $textHolder.find(".description").attr("text", bobData.Description);
}

/**
  * Deletes the html bob element with bobid from carousel
  * @param {string} bobid - id of the bob to be deleted
*/
function deleteElement(bobid){
  $("#" + bobid).remove();
}

/**
 * Creates and Returns a new html element from a given Bob object
 * @param {Object} - Javascript Bob object from Mongoose
 * @return {Object} - jQuery html elment of the created Bob
 */
function createBoardElement(bob) {
  var $html = $('<div>', {
    id: bob.id,
    class: "carousel-item"
  });

  // Bob flavor decides how each bob is rendered
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

    case 'Moment':
      $html.addClass('image-bobble flip').attr("id", bob._id)
        .append($('<div />', {class: "image-holder front", css: {'background-image': "url(" + bob.data.Link + ")"}}))
        .append($('<div />', {class: "text-holder back"})
          .append($('<p>', {class: "author", text: bob.data.Title}))
          .append($('<p />', {class:"description", text : bob.data.Descrption})));
      break;

    case 'Meme':
      $html.addClass('image-bobble flip').attr("id", bob._id)
        .append($('<div />', {class: "image-holder front", css: {'background-image': "url(" + bob.data.Link + ")"}}))
        .append($('<div />', {class: "text-holder back"})
          .append($('<p>', {class: "author", text: bob.data.Title}))
          .append($('<p />', {class:"description", text: bob.data.Descrption})));
      break;

    default:
      console.log("Unhandled type" + bob);
      $html = null;
  }
  return $html;
}


/**
  * Updates the label with the votes from bob with bobid
  * @param {string} bobid - id of the bob of the votes
*/
function updateVoteLabel(bobid){
  var $labelToUpdate = $("#votes");
  var votes =  $.get('/api/bobs/' + bobid + "/votes", function(res){
    $labelToUpdate.attr("data-badge-caption", "+" + res.votes);
  });
}

/**
  * Updates the label with the votes returned from socket
  * parpm {object} res - response from the socekt which contains bobid and votes
*/
function incrementVote(res){
  $("#votes").attr("data-badge-caption", "+" + res.votes);
}

/**
 * Resets time interval for the main carousel
 * Time Unit : ms.  Default Settings : 10s
 */
function resetInterval() {
  // Clears the existing timers
  clearInterval(carouselInterval);
  // Reinits the timers
  carouselInteral = setInterval(function() {
    $('#slideshow').carousel('next');
  }, 10000);
}
