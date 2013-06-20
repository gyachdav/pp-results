var NAME_CHANGE = function(arguments) {
	var targetDiv = arguments.targetDiv,
		dataObj = arguments.dataObj;


	var readOnlyDiv = targetDiv.find('.readonly').text(dataObj.getJobName());
	var writableDiv = jQuery('<input>').attr('type', 'text').addClass('input-large writable').hide();
	jQuery(targetDiv).find('h2').append(writableDiv);

	readOnlyDiv.mouseover(function() {
		jQuery(targetDiv).find('h2').append(jQuery('<i>').addClass("icon-pencil"));
		jQuery(this).addClass('border');
	}).mouseout(function() {
		jQuery(this).removeClass('border');
		jQuery(targetDiv).find('i').remove();
	}).click(function() {
		var v = jQuery(this).text();
		jQuery(writableDiv).val(v).show();
		jQuery(this).hide();
	});

	writableDiv.change(function() {
		event.preventDefault();
		var v = jQuery(this).val().trim();
		if (v != '') {
			dataObj.setJobName(v);
			readOnlyDiv.text(v);
			var posted = jQuery.post('api/job_name_change', {
				prot_name: v,
				reqid: dataObj.getJobID()
			}, function(data) {
				status = data.status;
				reason = data.reason;
			}, 'json');

			posted.done(function() {
				if (status != 'success') {
					var responseText = jQuery('<div/>')
						.html('Cannot rename request id ' + reqid + '. <br/><br/> Reason: ' + reason + '. <br/><br/> Please contact admin ')
						.addClass('alert alert-error');
					jQuery("#mainModalLabel").text('Error ');
					jQuery('#modal-container').html(responseText);
					jQuery('#mainModal').modal('show');
				}
			});
		}

		jQuery(this).hide();
		readOnlyDiv.show();
	}).blur(function() {
		event.preventDefault();
		var v = jQuery(this).val().trim();
		if (v != '') {
			dataObj.setJobName(v);
			readOnlyDiv.text(v);
		}
		jQuery(this).hide();
		readOnlyDiv.show();
	});

};