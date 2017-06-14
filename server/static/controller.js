function submitText(text_value) {
  var text_object = {'type': 'text', 'value': text_value};

  socket.emit('add_element', text_object);
  console.log("submitted", text_object);
}

const socket = io();
socket.emit('connection', 'controller');

$(function() {
	// Runs when the document has loaded, $ is jQuery
	$.get('/tags', function(tagArray) {
		$.each(tagArray, function(index, tag) {
			$('#tag-holder').append('<label>\
				<input type="checkbox" name="tags" value="' + tag + '"></input>' + tag + '\
			</label><br>');
		});
	});

	// Need to implement route that serves Flavors
	// $.get('/flavors', function(flavorArray) {
	// 	$.each(flavorArray, function(index, flavor) {
	// 		$('#flavor').append('<option value="' + flavor + '">' + flavor + '</option>');
	// 	});
	// });

	$('#add-bob-form').submit(function(event) {
		event.preventDefault();

		let $form = $(this)
		let tags = [];
		$form.find('[name="tags"]:checked').each(function() {
			tags.push($(this).val());
		});
		
		let data = {
			data: $form.find('[name="data"]').val(),
			flavor: $form.find('#flavor').val(),
			date: $form.find('#date').val(), // Datepicker doesn't exist yet
			tags: tags
		}
	});
})

console.log("controller.js running");
