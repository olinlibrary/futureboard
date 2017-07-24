/**
 * Populates admin Table by creating jQuery DOM elements for given bobs,
 * @param {Object[]} bobs - Array of Bob objects to be displayed on the table
*/
function popluateTable(bobs) {
  let $bobTable = $("#bobTable");
  $bobTable.empty(); // Clear the table before adding to it
  let tableColumns = ["Flavor", "ID", "StartDate", "Preview", "Votes", "Flag", "Active", "Edit", "Delete"];
  let $html = $('<tr>', {});
  for (let i in tableColumns){
    $html.append($('<th>', { text: tableColumns[i] }));
  }
  $bobTable.append($html);
  for (var i = 0; i < bobs.length; i++) {
    $bobTable.append(createBobElement(bobs[i]));
  }
}

function popluateFlaggedTable(flaggedBobs) {
  let $flaggedBobTable = $("#flaggedBobTable");
  $flaggedBobTable.empty(); // Clear the table before adding to it
  let tableColumns = ["Flavor", "ID", "StartDate", "Preview", "Votes", "Flag", "Active", "Edit", "Delete"];
  let $html = $('<tr>', {});
  for (let i in tableColumns){
    $html.append($('<th>', { text: tableColumns[i] }));
  }
  $flaggedBobTable.append($html);
  for (var i = 0; i < flaggedBobs.length; i++) {
    $flaggedBobTable.append(createBobElement(flaggedBobs[i]));
  }
}

/**
 * Creates and returns a jQuery element of a given Bob object,
 * then appends it to the admin table
 * @param {Object} bob - A single Bob object to be added to the carousel
 * @returns {Object} $html - new jQuery element for the new Bob
*/
function createBobElement(bob) {
  let $editButton = $('<a>', {
    href: '/bobs/'+ bob._id,
    text: 'Edit'
  });

  let $deleteButton = $('<a>', {
    onclick: 'deleteBob("' + bob._id + '")',
    href: 'javascript:void(0);',
    text: 'delete'
  });

  let $preview = null;
  if(bob.flavor === 'Moment'){
    $preview = $('<img>', {
      src: bob.data.Link,
      href: bob.data.Link,
      class: 'preview'
    });
  } else if (bob.flavor === 'Video') {
    $preview = $('<video>', {
      src: bob.data.Link,
      autoplay: true,
      loop: true,
      muted: true,
      href: bob.data.Link,
      class: 'preview',
      poster:'static/images/test-pump.gif'
    });
  }

  let bobColumns = [
    '<p>' + bob.flavor + '</p>',
    '<p>' + bob._id + '</p>',
    '<p>' + bob.startDate + '</p>',
    $preview,
    '<p>' + bob.votes + '</p>',
    '<p>' + bob.flag + '</p>',
    '<p>' + (Date.now() > new Date(bob.startDate) && Date.now() < new Date(bob.endDate)) + '</p>',
    $editButton,
    $deleteButton
  ];

  let $html = $('<tr>', {bobid: bob._id, class: "bob-item"});

  for (let i in bobColumns){
    $html.append($('<td>')
      .append(bobColumns[i])
    );
  }
  return $html;
}

/**
 * Creates a jQuery element of a new bob object
 * @param {Object} newBob - A newly created Bob to be appended to the table
*/
function addTableElement(newBob) {
  $("#bobTable").append(createBobElement(newBob));
}

/**
 * Deletes a Bob from both the server db and removes it from the bob table
 * @param {String} bobid - the bobid of target bob to be deleted
*/
function deleteBob(bobid) {
  if(confirm("Actually delete " + bobid + "?")) {
    $.ajax({
			url: '/api/bobs/' + bobid,
			type: 'DELETE',
			headers: { auth: 'hunter2' },
			success: function(res) {
        $('[bobid="' + bobid + '"]').remove();
				alert(res);
			},
      error: function(res) {
        alert(res.statusText);
      }
		});
  }
}


$.get('/api/bobs', popluateTable);
$.ajax({
    url: '/api/bobs/flagged',
    headers: {'auth': 'hunter2'},
    success: popluateFlaggedTable
  });

var socket = io();
socket.emit('connection');
socket.on('add_element', addTableElement);

console.log("admin.js running");
