
const socket = io();
socket.emit('connection', 'controller');

$(function() {

	$('#start-date').datepicker();
	$('#end-date').datepicker();
	$('#start-date').datepicker('setDate', new Date());

	// Runs when the document has loaded, $ is jQuery
	$.get('/tags', function(tagArray) {
		$.each(tagArray, function(index, tag) {
			$('#tag-holder').append('<label>\
				<input type="checkbox" name="tags" value="' + tag + '"></input>' + tag + '\
			</label><br>');
		});
	});

	var flavors = [];
	$.get('/flavors', function(flavorArray) {
		flavors = flavorArray;
		let $flavors = $('#flavor');

		$.each(flavorArray, function(index, flavor) {
			$flavors.append('<option value="' + flavor.name + '">' + flavor.name + '</option>');
		});

		$flavors.on('change', function() {
			// Subtract 1 from index as the first option is a placeholder
			let index = $flavors.find('option:selected').index() - 1;
			let flavor = flavorArray[index];
			$('#data').html('');
			$.each(flavor.fields, function(i, field) {
				$('#data').append('<div class="data-field">\
					<label for="' + field.name + '">' + field.name + '</label><br>\
			        <input id="' + field.name + '" name="' + field.name + '" type="' + field.input + '"></input>\
			    </div>');
			});
		});
	});

	$('#add-bob-form').submit(function(event) {
		event.preventDefault();

		let $form = $(this)
		
		let tags = [];
		$form.find('[name="tags"]:checked').each(function() {
			tags.push($(this).val());
		});

		let bobData = {};
		$form.find('#data input').each(function() {
			let $input = $(this);
			bobData[$input.attr('name')] = $input.val();
		});
		
		let data = {
			data: bobData,
			flavor: $form.find('#flavor').val(),
			startDate: $form.find('#start-date').val(),
			endDate: $form.find('#end-date').val(),
			'tags[]': tags
		}

		$.post('/controller', data, function(res) {
			alert('Bob saved!');
		});
	});
})

console.log("controller.js running");
