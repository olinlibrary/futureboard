
/**
  * Populates events element by creating and appending even items from ABE
  * @param {Object[]} eventsData - list of JSON events data
*/
function populateEvents(eventsData) {
  let $eventsToday = $('#eventsToday');
  let $eventsTomorrow = $('#eventsTomorrow');
  let $eventsThisWeek = $('#eventsThisWeek');

  let $broadcast = $(".happeningNow");
  var broadcastText = "HAPPENING SOON :  ";
  for (var i = 0; i < eventsData.length - 1; i++) {
    let $newEvent = createEventObject(eventsData[i]);
    // Uses Date.JS to process time
    let eventStart = Date.parse(eventsData[i].start).toString("MMdd");
    let today = Date.today().toString("MMdd");
    let tomorrow = (1).day().fromNow().toString("MMdd");
    let thisWeek = (7).day().fromNow().toString("MMdd");

    if(today === eventStart){
      eventTime = "Today";
    }
    else if(tomorrow === eventStart){
      eventTime = "Tomorrow";
    }
    else if(eventStart > tomorrow){
      eventTime = "ThisWeek";
    }
    else{
      eventTime = null;
    }

    switch(eventTime){
      case 'Today':
        $eventsToday.append($newEvent);
        broadcastText += eventsData[i].title;
        broadcastText += "@" + Date.parse(eventsData[i].start).toString("HH:mm") +",  ";
        break;
      case 'Tomorrow':
        $eventsTomorrow.append($newEvent);
        break;
      case 'ThisWeek':
        $eventsThisWeek.append($newEvent);
        break;
    }
  }
  console.log(broadcastText)
  $broadcast.append($("<p/>", {text: broadcastText}) );
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
