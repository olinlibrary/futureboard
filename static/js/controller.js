/**
 * Runs when the document has loaded
 * $ -> jQuery shorthand for vanilla JS "document.ready()"
*/
$(function() {
	// Initializes datepicker calendar
	$('#start-date').datepicker();
	$('#end-date').datepicker();
	$('#start-date').datepicker('setDate', new Date());

	/**
	 * Loads tags data from the server using a HTTP GET request,
	 * Creates tag holder html element for each tag
	 * @param {string} url - A string containing the URL to tags GET request
	 * @param {successCallback} function - creates html element tag labels
	*/
	$.get('/tags', function(tagArray) {
		$.each(tagArray, function(index, tag) {
			$('#tag-holder').append('<label>\
				<input type="checkbox" name="tags" value="' + tag.title + '"></input>' + tag.title + '\
			</label><br>');
		});
	});

	var flavors = [];
	/**
	 * Loads flavors data from the server using a HTTP GET request,
	 * @param {string} url - A string containing the URL to tags GET request
	 * @param {successCallback} function - A callback function
	*/
	$.get('/flavors', function(flavorArray) {
		flavors = flavorArray;
		let $flavors = $('#flavor');

		/**
		 * Loads flavors data from the server using a HTTP GET request,
		 * Creates tag holder html element for each tag
		 * @param {object[]} flavorArray - A list of returned flavor objects
		 * @param {successCallback} function - creates html element tag labels
		*/
		$.each(flavorArray, function(index, flavor) {
			$flavors.append('<option value="' + flavor.name + '">' + flavor.name + '</option>');
		});

		/**
		 * Attaches a 'change' event handler for flavor html elements
		 * @param {string} event - A string containing the URL to tags GET request
		 * @param {successCallback} function - Updates "selected" html flavor
		*/
		$flavors.on('change', function() {
			// Subtract 1 from index as the first option is a placeholder
			let index = $flavors.find('option:selected').index() - 1;
			let flavor = flavorArray[index];
			$('#data').html('');
			$.each(flavor.fields, function(i, field) {
				$('#data')
					.append($('<label>', {for: field.name, text: field.name, class: "mui--text-title"}))
					.append($('<div>', {class: "data-field mui-" + field.input + "field"})
						.append($('<input>', {id: field.name, name: field.name, type: field.input}))
			    );
			});
		});
	});

	/**
	 * Submits the Bob data created from reading values from each html input form
	*/
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

		/**
		 * Posts input data to the server using POST request
		 * @param {string} url - A string containing the URL to POST request
		 * @param {Object} data - An object that contains a new bob data
		 * @param {successCallback} function - A callback called upon success
		*/
		$.post('/controller', data, function(res) {
			alert('Bob saved!');
		});
	});
});

console.log("controller.js running");
