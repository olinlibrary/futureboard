/**
 * Runs when the document has loaded
 * $ -> jQuery shorthand for vanilla JS "document.ready()"
*/

$(function() {
	// Get bob id from url (last parameter)
	url = window.location.href.split('/');
	bobid = url[4];

	$('#start-date').datepicker();
	$('#end-date').datepicker();
	$('#start-date').datepicker('setDate', new Date());

	createAndPrefillForm(bobid);


	/**
	 * On clicking submit button
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
			url: '/api/bobs/' + bobid,
			type: 'PUT',
			data: data,
			success: function(res) {
				alert(res);
				// Redirect to previous page or FUTUREboard
				if (document.referrer !== "") {
					window.location = document.referrer;
				} else {
					window.location = "/";
				}
			},
			error: function(res) {
				alert(res.statusText);
			}
		});
	});
});

/**
* Populates input forms with current bob values
*/
function createAndPrefillForm(bobid) {
	if(bobid.length !== 24){
		throw("bobid not valid");
	}
	/**
	* Loads Bob Object from the server using a HTTP GET request,
	* @param {string} url - A string containing the route to Bob GET request
	* @param {successCallback} function - Fills elements with Bob data values.
	*/
	$.get('/api/bobs/' + bobid, function (bob) {
		console.log(bob);
		let $form = $('add-bob-form');

		// Populate fields from the current bob values
		$('#bob-id').val(bob._id);
		$('#flavor').val(bob.flavor);
		$('#start-date').val(bob.startDate);
		$('#end-date').val(bob.endDate);

		// Create the correct fields based on the bob's flavor
		$.get('/api/flavors/' + bob.flavor, function (flavor) {
			$.each(flavor.fields, function(i, field) {
				console.log(bob.data[field.name]);
				$('#data')
					.append($('<label>', {for: field.name, text: field.name, class: "mui--text-title"}))
					.append($('<div>', {class: "data-field mui-" + field.input + "field"})
					.append($('<input>', {id: field.name, name: field.name, type: field.input, val: bob.data[field.name]}))
					);
			});
		});

		// Create tag checkboxes and prefill them
		$.get('/api/tags', function(tagArray) {
			let checked = false;
			$.each(tagArray, function(index, tag) {
				// checked = bob.tags includes current tag
				checked = bob.tags.indexOf(tag.title) !== -1;
				// Add checkbox and field, with pre-checked values
				$('#tag-holder').append('<label>\
				<input type="checkbox" name="tags" value="' + tag.title + '"' + (checked?' checked="true" ':'') +'></input>' + tag.title + '\
				</label><br>');
			});
		});
	});
}

console.log("controller.js running");
