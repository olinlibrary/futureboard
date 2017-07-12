/**
 * Runs when the document has loaded
 * $ -> jQuery shorthand for vanilla JS "document.ready()"
*/

$(function() {
	// Get bob id from url
	url = window.location.href.split('/')
	bobId = url[url.length - 1];

	$('#start-date').datepicker();
	$('#end-date').datepicker();
	$('#start-date').datepicker('setDate', new Date());

	/**
	 * Loads tags data from the server using a HTTP GET request,
	 * Creates tag holder html element for each tag
	 * @param {string} url - A string containing the URL to tags GET request
	 * @param {successCallback} function - creates html element tag labels
	*/
	$.get('/api/tags', function(tagArray) {
		$.each(tagArray, function(index, tag) {
			$('#tag-holder').append('<label>\
				<input type="checkbox" name="tags" value="' + tag.title + '"></input>' + tag.title + '\
			</label><br>');
		});
	});

	/**
	 * Loads flavors data from the server using a HTTP GET request
	 * @todo - will be deprecated soon(don't need all the flavors from db)
	 * @param {string} url - A string containing the URL to tags GET request
	 * @param {successCallback} function - A callback function
	*/
	var flavors = [];
	$.get('/api/flavors', function (flavorArray) {
		// Editing Flavor of Bobs is not allowed.
		flavors = flavorArray;
		// Needs to run after flavors get filled, otherwise there is a race condition
		fillInputFields(bobId);
	});




	/**
	 * Populates input forms with current bob values
	*/
function fillInputFields(bobId) {

		/**
		 * Loads Bob Object from the server using a HTTP GET request,
		 * @param {string} url - A string containing the route to Bob GET request
		 * @param {successCallback} function - Fills elements with Bob data values.
		*/
	$.get('/api/bobs/' + bobId, function (bob) {
		cur_bob = bob;
		let $form = $('add-bob-form');

		// Create the correct fields based on the bob's flavor
		updateInputFromFlavor(bob.flavor, flavors);

		$('#bob-id').val(bob._id);
		$('#flavor').val(bob.flavor);
		$('#start-date').val(bob.startDate);
		$('#end-date').val(bob.endDate);

		// Fill the data forms
		$.each(bob.data, function (key) {
			$(String('#' + key)).val(bob.data[key]);
		});

		// Fill the tag forms
		$.each(bob.tags, function (i) {
			$(':input[value="' + bob.tags[i] + '"]').attr('checked', true);
		});
	});
}

	/**
	 * Submits the Bob data created from reading values from the form fields
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

		// Create bob data from the values of each input form
		let data = {
			id: $form.find('#bob-id').val(),
			data: bobData,
			startDate: $form.find('#start-date').val(),
			endDate: $form.find('#end-date').val(),
			'tags[]': tags
		}

		// Send the bob through the api with a PUT request. (ajax is required to create PUT requests)
		$.ajax({
			url: '/api/bobs/' + bobId,
			type: 'PUT',
			data: data,
			success: function(res) {
					alert(res);
				}
		});
	});
});

/**
 * Populates input forms that matches current Bob's flavor fields
 * @param {string} flavorName - The name of flavor
 * @param {Object[]} flavorArray - List of all flavors from the server db
*/
function updateInputFromFlavor(flavorName, flavorArray) {
	let flavor = null;
	for(let i = 0; i < flavorArray.length; i++){
		if(flavorArray[i].name === flavorName){
			// Sets the flavor object
			flavor = flavorArray[i];
			break;
		}
	}

	// Clear the current form
	$('#data').empty();
	// Add fields from the flavor object
	$.each(flavor.fields, function(i, field) {
		$('#data')
			.append($('<label>', {for: field.name, text: field.name, class: "mui--text-title"}))
			.append($('<div>', {class: "data-field mui-" + field.input + "field"})
				.append($('<input>', {id: field.name, name: field.name, type: field.input}))
			);
	});
}


console.log("controller.js running");
