
/**
  * Populates events element by creating and appending even items from ABE
  * @param {Object[]} eventsData - list of JSON events data
*/
function populateEvents(eventsData) {
  let $eventsToday = $('#eventsToday');
  let $featuredEvents = $('#featuredEvents');

  for (var i = 0; i < eventsData.length ; i++) {
    let featured = (($.inArray("featured", eventsData[i].labels)) >= 0);

    let eventStart = Date.parse(eventsData[i].start).toString("YYMMdd");
    let today = Date.today().toString("YYMMdd");

    if(today === eventStart){
      let $newEvent = createEventObject(eventsData[i]);
      $eventsToday.append($newEvent);
    }

    if (featured && (Date.today().compareTo(Date.parse(eventsData[i].start)) == -1)){
      let $newEvent = createFeaturedEventObject(eventsData[i]);
      $featuredEvents.append($newEvent);
    }

  }
}

/**
  * Creates html element for an event parsed from ABE.com
  * @param {Object} eventData - A single JSON instance of ABE event
*/
function createEventObject(eventData) {
  var converter = new showdown.Converter(); // markdown converter
  if(eventData.location != null){
    var location = "@ " + eventData.location.substring(0, 30);
  }
  else {
    var location = "";
  }
  var $html = $('<li>', {
    id: eventData.id,
    class: "collection-item"
  })
    .append($('<span>', { class: 'title', text: eventData.title.substring(0, 30) }))
    .append($('<p>', { class: 'location', text: location }))
    .append($('<p>', { class: 'date', text: Date.parse(eventData.start).toString("hh:mm tt") + " - " + Date.parse(eventData.end).toString("hh:mm tt") }))
    .append(converter.makeHtml(eventData.description))
    .append($('<span/>', {class: "clear"}));
  return $html;
}

/**
  * Creates html element for an event parsed from ABE.com
  * @param {Object} eventData - A single JSON instance of ABE event
*/
function createFeaturedEventObject(eventData) {
  var converter = new showdown.Converter(); // markdown converter
  if(eventData.location != null){
    var location = "@ " + eventData.location.substring(0, 30);
  }
  else {
    var location = "";
  }
  var $html = $('<li>', {
    id: eventData.id,
    class: "collection-item"
  })
    .append($('<span>', { class: 'title', text: eventData.title.substring(0, 30) }))
    .append($('<p>', { class: 'location', text: location }))
    .append($('<p>', { class: 'date', text: Date.parse(eventData.start).toString("hh:mm tt, ddd, MMMM dd ") + " - " + Date.parse(eventData.end).toString("hh:mm tt, ddd, MMMM dd") }))
    .append(converter.makeHtml(eventData.description))
    .append($('<span/>', {class: "clear"}));
  return $html;
}

/**
 * When Document is ready,
 * Defines time interval for carousel auto slides,
 * Listens on click and touch events for flip, swap buttons
 * Listens on click and touch events for plusOne, flag buttons
 * Listens on tab buttons for toggling the events
 * Time Unit : ms.  Default Settings : 10s, 7s(small slide)
 */
$(function(){
  $.get('https://abe-dev.herokuapp.com/events/', populateEvents);
  //  // Initializes auto scroll for events
   var scrolltopbottom = setInterval(function(){
    $('.today .autoscrolling > .collection').animate({ scrollTop: $('.today .autoscrolling > .collection').prop('scrollHeight') }, 12000);
    setTimeout(function() {
       $('.autoscrolling > .collection').animate({scrollTop:0}, 8000);
    },4000);
  },4000);

  //  // Initializes auto scroll for events
   var scrolltopbottom = setInterval(function(){
    $('.featured .autoscrolling > .collection').animate({ scrollTop: $('.featured .autoscrolling > .collection').prop('scrollHeight')  }, 10000);
    setTimeout(function() {
       $('.featured .autoscrolling > .collection').animate({scrollTop:0}, 8000);
    },4000);
  },1000);
});
