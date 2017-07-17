
/**
  * Populates events element by creating and appending even items from ABE
  * @param {Object[]} eventsData - list of JSON events data
*/
function populateEvents(eventsData) {
  let $eventsToday = $('#eventsToday');
  let $featuredEvents = $('#featuredEvents');

  for (var i = 0; i < eventsData.length ; i++) {
    // Uses Date.JS to process time
    console.log(eventsData[i].labels)
    let featured = $.inArray("featured", eventsData[i].labels);
    let eventStart = Date.parse(eventsData[i].start).toString("YYMMdd");
    let today = Date.today().toString("YYMMdd");
    // let tomorrow = (1).day().fromNow().toString("MMdd");
    // let thisWeek = (7).day().fromNow().toString("MMdd");

    if(today === eventStart){
      let $newEvent = createEventObject(eventsData[i]);
      $eventsToday.append($newEvent);
    }
    if(featured >= 0){
      let $newEvent = createFeaturedEventObject(eventsData[i]);
      $featuredEvents.append($newEvent);
    }
    else{
      //todo
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
    .append($('<span>', { class: 'title', text: eventData.title }))
    .append($('<p>', { class: 'date', text:  Date.parse(eventData.start).toString("HH:mm ddd, MMMM dd") +" @ " + eventData.location}))
    .append($('<p>', { class: 'description', text: eventData.description }));
  return $html;
}

/**
  * Creates html element for an event parsed from ABE.com
  * @param {Object} eventData - A single JSON instance of ABE event
*/
function createFeaturedEventObject(eventData) {
  var $html = $('<li>', {
    id: eventData.id,
    class: "collection-item"
  })
    .append($('<span>', { class: 'title', text: eventData.title }))
    .append($('<p>', { class: 'date', text:  Date.parse(eventData.start).toString("HH:mm ddd, MMMM dd") +" @ " + eventData.location}))
    .append($('<p>', { class: 'description', text: eventData.description }));
  return $html;
}
