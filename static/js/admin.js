function popluateTable(bobs) {
  let $bobTable = $("#bobTable");
  $bobTable.empty(); // Clear the table before adding to it

  let tableColumns = ["Flavor", "ID", "StartDate", "EndDate", "Active", "Edit", "Delete"];

  let $html = $('<tr>', {});
  for (let i in tableColumns){
    $html.append($('<th>', { text: tableColumns[i] }));
  }
  $bobTable.append($html);
  for (var i = 0; i < bobs.length; i++) {
    $bobTable.append(createBobElement(bobs[i]));
  }
}

function createBobElement(bob) {
  let $editButton = $('<a>', {
    href: './editbob?bobid='+ bob._id,
    text: 'Edit'
  });
  // let deleteButton = '<a href=./deletebob?bobid='+ bob._id + '>Delete Bob</a>';
  let $deleteButton = $('<a>', {
    onclick: 'deleteBob("' + bob._id + '")',
    href: 'javascript:void(0);',
    text: 'delete'
  });

  let bobColumns = [
    '<p>' + bob.flavor + '</p>',
    '<p>' + bob._id + '</p>',
    '<p>' + bob.startDate + '</p>',
    '<p>' + bob.endDate + '</p>',
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

  console.log($html);
  return $html;
}

function addTableElement(newBob) {
  $("#bobTable").append(createBobElement(newBob));
}

function deleteBob(bobid) {
  if(confirm("Actually delete " + bobid + "?")) {
    $.post('/deleteBob?bobid=' + bobid);
    $('[bobid="' + bobid + '"]').remove();
  }
}

var socket = io();
socket.emit('connection');

socket.on('all_elements'  , popluateTable);
socket.on('add_element'   , addTableElement);

console.log("admin.js running");
