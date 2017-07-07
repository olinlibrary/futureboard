$(function() {
	bobid =

	$('#start-date').datepicker();
	$('#end-date').datepicker();
	$('#start-date').datepicker('setDate', new Date());

	// Runs when the document has loaded, $ is jQuery
	$.get('/tags', function(tagArray) {
		$.each(tagArray, function(index, tag) {
			$('#tag-holder').append('<label>\
				<input type="checkbox" name="tags" value="' + tag.title + '"></input>' + tag.title + '\
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
				$('#data')
					.append($('<label>', {for: field.name, text: field.name, class: "mui--text-title"}))
					.append($('<div>', {class: "data-field mui-" + field.input + "field"})
						.append($('<input>', {id: field.name, name: field.name, type: field.input}))
			    );
			});
		});
	});

  // Populate form with current bob values

  $.get('/getbob?bobid=' + getUrlParameter("bobid"), function (bob) {
    //add fill in input
		console.log(bob);
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
      id: $form.find('#bob-id'),
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
});

var getUrlParameter = function getUrlParameter(sParam) {
    var sPageURL = decodeURIComponent(window.location.search.substring(1)),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : sParameterName[1];
        }
    }
};

console.log("controller.js running");
