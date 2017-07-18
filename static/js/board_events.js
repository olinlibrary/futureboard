
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
    // let tomorrow = (1).day().fromNow().toString("MMdd");
    // let thisWeek = (7).day().fromNow().toString("MMdd");

    if(today === eventStart){
      let $newEvent = createEventObject(eventsData[i]);
      $eventsToday.append($newEvent);
    }

    if (featured){
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
  var $html = $('<li>', {
    id: eventData.id,
    class: "collection-item"
  })
    .append($('<span>', { class: 'title', text: eventData.title.substring(0, 30) }))
    .append($('<p>', { class: 'location', text:"@ " + eventData.location.substring(0, 30) }))
    .append($('<p>', { class: 'date', text: Date.parse(eventData.start).toString("hh:mm tt") + " - " + Date.parse(eventData.end).toString("hh:mm tt") }))
  return $html;
}

/**
  * Creates html element for an event parsed from ABE.com
  * @param {Object} eventData - A single JSON instance of ABE event
*/
function createFeaturedEventObject(eventData) {
  var converter = new showdown.Converter(); // markdown converter
  var $html = $('<li>', {
    id: eventData.id,
    class: "collection-item"
  })
    .append($('<span>', { class: 'title', text: eventData.title.substring(0, 30) }))
    .append($('<p>', { class: 'location', text:"@ " + eventData.location.substring(0, 30) }))
    .append($('<p>', { class: 'date', text: Date.parse(eventData.start).toString("hh:mm tt, ddd, MMMM dd ") + " - " + Date.parse(eventData.end).toString("hh:mm tt, ddd, MMMM dd") }))
    .append(converter.makeHtml(eventData.description));
  return $html;
}
