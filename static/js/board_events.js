/**
  * Populates events element by creating and appending even items from ABE
  * @param {Object[]} eventsData - list of JSON events data
*/
function populateEvents(eventsData) {
  const $eventsToday = $('#eventsToday');
  const $featuredEvents = $('#featuredEvents');
  const $addedFeaturedEventsTitles = [];
  eventsData.forEach((event) => {
    const featured = (($.inArray("featured", event.labels)) >= 0);
    const eventStart = Date.parse(event.start).toString("YYMMdd");
    const today = Date.today().toString("YYMMdd");
    if (today === eventStart){
      let $newEvent = createEventObject(event);
      $eventsToday.append($newEvent);
    }
    if (featured && (Date.today().compareTo(Date.parse(event.start)) == -1)){
      // checks for recurring events, adds only the first instance of recurring events
      if ($.inArray(event.title, $addedFeaturedEventsTitles) < 0){
        const $newEvent = createFeaturedEventObject(event);
        $featuredEvents.append($newEvent);
        $addedFeaturedEventsTitles.push(event.title);
      }
    }
  });
  $('#eventsToday > li').sortElements(function(a, b){
    return $(a).find('.rawDate').text() > $(b).find('.rawDate').text() ? 1 : -1;
  });
  $('#featuredEvents > li').sortElements(function(a, b){
    return $(a).find('.rawDate').text() > $(b).find('.rawDate').text() ? 1 : -1;
  });
}

/**
  * Creates html element for an event parsed from ABE.com
  * @param {Object} eventData - A single JSON instance of ABE event
*/
function createEventObject(eventData) {
  var converter = new showdown.Converter(); // markdown converter
  let location = "";
  if(eventData.location != null){
    location = "@ " + eventData.location.substring(0, 30);
  }
  let title = eventData.title;
  if(title.length > 40){
    title = eventData.title.substring(0, 40) + "…";
  }
  // addHours(-4) to adjust timezone(UTC) to Eastern Time:
  const endHours = Date.parse(eventData.end.replace(/\.\d+$/, '')).addHours(-4).toString("hh:mm tt");
  const $html = $('<li>', {
    id: eventData.id,
    class: "collection-item"
  })
    .append($('<span>', { class: 'title', text: title}))
    .append($('<p>', { class: 'location', text: location }))
    .append($('<p>', { class: 'rawDate', text: Date.parse(eventData.start).addHours(-4).toString("yyyyMMddHHmmss"), style: 'display:none'})) // addHours(-4) to adjust timezone(UTC) to Eastern Time
    .append($('<p>', { class: 'date', text: Date.parse(eventData.start).addHours(-4).toString("hh:mm tt") + " - " + endHours }))
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
  let location = "";
  if(eventData.location != null){
    location = "@ " + eventData.location.substring(0, 30);
  }
  let title = eventData.title;
  if(title.length > 40){
    title = eventData.title.substring(0, 40) + "…";
  }
  // addHours(-4) to adjust timezone(UTC) to Eastern Time:
  const endHours = Date.parse(eventData.end.replace(/\.\d+$/, '')).addHours(-4).toString("hh:mm tt, dddd, MMM dd ");
  var $html = $('<li>', {
    id: eventData.id,
    class: "collection-item"
  })
    .append($('<span>', { class: 'title', text: title}))
    .append($('<p>', { class: 'location', text: location }))
    .append($('<p>', { class: 'rawDate', text: Date.parse(eventData.start).addHours(-4).toString("yyyyMMddHHmmss"), style: 'display:none'})) // addHours(-4) to adjust timezone(UTC) to Eastern Time
    .append($('<p>', { class: 'date', text: Date.parse(eventData.start).addHours(-4).toString("hh:mm tt") + " - " + endHours }))
    .append(converter.makeHtml(eventData.description))
    .append($('<span/>', {class: "clear"}));


  return $html;
}

/**
  * Initializes auto scroll events
  * @param {Object} $collectionSelection - jQuery object of the selected events
  * @param {Object} $scrollToBottom - boolean flag for scrolling direction
*/

function scrollEvents($collectionSelection, scrollToBottom = true) {
  $collectionSelection.animate({ scrollTop: (scrollToBottom) ? $collectionSelection.prop('scrollHeight') : 0 }, 12000);
  setTimeout(function() {
    scrollEvents($collectionSelection, !scrollToBottom);
  }, 4000)
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

  // parse events from abe JSON URL
  $.get(ABE_API_URI + '/events/', populateEvents);

  // Initializes auto scroll for events
  var $eventsToday = $('.today .autoscrolling > .collection')
  var $eventsFeatured = $('.featured .autoscrolling > .collection')
  var eventsTodayScroll = scrollEvents($eventsToday, true);
  var eventsFeaturedScroll = scrollEvents($eventsFeatured, true);

  // clears the interval on scroll event,resets timer 10 seconds later
  $eventsToday.on("click", function(){
    clearInterval(eventsTodayScroll);
    $eventsToday.stop(); // stops the animation
  });
  $eventsFeatured.on("click", function(){
    clearInterval(eventsFeaturedScroll);
    $eventsFeatured.stop(); // stops the animation
  });
});
