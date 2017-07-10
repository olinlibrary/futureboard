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
	 * Loads flavors data from the server using a HTTP GET request
	 * @todo - will be deprecated soon(don't need all the flavors from db)
	 * @param {string} url - A string containing the URL to tags GET request
	 * @param {successCallback} function - A callback function
	*/
	$.get('/flavors', function(flavorArray) {
		// Editing Flavor of Bobs is not allowed.

		flavors = flavorArray;
		// Needs to run after flavors get filled, otherwise there is a race condition
		fillInputFields();
	});


	/**
	 * Populates input forms with current bob values
	*/
	function fillInputFields() {

		/**
		 * Loads Bob Object from the server using a HTTP GET request,
		 * @param {string} url - A string containing the route to Bob GET request
		 * @param {successCallback} function - Fills elements with Bob data values.
		*/
	  $.get('/getbob?bobid=' + getUrlParameter("bobid"), function (bob) {
			let $form = $('add-bob-form');

			updateInputFromFlavor(bob.flavor, flavors);

			$('#bob-id').val(bob._id);
			$('#flavor').val(bob.flavor);
			$('#start-date').val(bob.startDate);
			$('#end-date').val(bob.endDate);

			// fills the data forms
			$.each(bob.data, function (key) {
				$(String('#' + key)).val(bob.data[key]);
			});

			// fills the tag forms
			$.each(bob.tags, function (i) {
				$(':input[value="' + bob.tags[i] + '"]').attr('checked', true);
			});
	  });
	}

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

		// Creates bob data from the values of each input form
		let data = {
      id: $form.find('#bob-id').val(),
			data: bobData,
			startDate: $form.find('#start-date').val(),
			endDate: $form.find('#end-date').val(),
			'tags[]': tags
		}

		/**
		 * Posts input data to the server using POST request
		 * @param {string} url - A string containing the URL(route) to POST request
		 * @param {Object} data - An object that contains a new bob data
		 * @param {successCallback} function - A callback called upon success
		*/
		$.post('/editbob', data, function(res) {
			alert('Bob saved!');
		});
	});
});

/**
 * Populates input forms that matches current Bob's flavor fields
 * @param {string} flavorName - The name of flavor
 * @param {Object[]} flavorArray - List of all flavors from the server db
*/
function updateInputFromFlavor(flavorName, flavorArray) {

	// Subtract 1 from index as the first option is a placeholder
	let flavor = null;

	//Using "flavor = Bob.flavor" is more concise, left here for extension later
	for(let i = 0; i < flavorArray.length; i++){
		if(flavorArray[i].name === flavorName){
			flavor = flavorArray[i];
			break;
		}
	}
	// On init it is -1, only after an option is selected should you update
	$('#data').html('');
	$.each(flavor.fields, function(i, field) {
		$('#data')
			.append($('<label>', {for: field.name, text: field.name, class: "mui--text-title"}))
			.append($('<div>', {class: "data-field mui-" + field.input + "field"})
				.append($('<input>', {id: field.name, name: field.name, type: field.input}))
	    );
	});
}

/**
 * Extracts features that match sParam from the URL
 * @todo : this will be deprecated, we aren't really using this anymore.
 * @param {string} sParam  - Target Feature
 * @returns {string} sParameterName - Extracted feature
*/
function getUrlParameter(sParam) {
    var sPageURL = decodeURIComponent(window.location.search.substring(1)),
        sURLVariables = sPageURL.split('&'),
        sParameterName;

    for (let i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : sParameterName[1];
        }
    }
};

console.log("controller.js running");
