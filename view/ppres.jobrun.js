var JOB_RUN = function(config) {
    var reqid = config.reqid;
    var original_date = config.original_date;
    var target_div = config.target_div;
    if (!reqid)
        reqid = 2;

    var jobRunModal = new MODAL({
        modalName: 'JobRunDialogue',
        modalTitle: "Resubmit Job",
        content: "Are you sure you would like to resubmit this job to the processing queue?",
        modalDialog: true
    });


    var jobRunDiv = jQuery('<div/>').addClass('alert alert-error' )
        .append(jQuery('<div/>').text('The results for this sequence were generated on ' + original_date + ' and are older than 3 months. We recommend that you re-run this job to get a more up-to-date (and possibly more accurate) result. You can resubmit the job by pressing the "Resubmit Job" button.'))
	.append(jQuery('<div/>')).append(
            jQuery('<a/>')
		.attr('id', 'JobRunDialogueBttn')
		.attr('href', '#JobRunDialogue')
		.addClass('btn btn-danger')
		.text('Resubmit Job'));

    jQuery('.'+target_div).append(jobRunDiv);


    jQuery("#JobRunDialogueBttn").on("click", function() {
        jobRunModal.getModalDiv().modal('toggle');
    });

    jobRunModal.getModalDiv().on("hide", function() {
        if (jobRunModal.getDialogueAnswer() !== "-1" && jobRunModal.getDialogueAnswer() == true) {

            var status, reason, reason_text;

            var posting = jQuery.post('api/job_resubmit', {
                reqid: reqid
            }, function(data) {
                console.log('success');
                status = data.status;
                reason = data.reason;
                reason_text = data.reason_text;
            }, 'json');

            posting.done(function() {
                jQuery('.info').html('Resubmitted');
                if (status != 'success') {
                    var responseText = jQuery('<div/>')
                        .html('Cannot resubmit request id ' + reqid + '. <br/><br/> Reason: ' + reason + '. <br/><br/> Please contact admin ')
                        .addClass('alert alert-error');
                    jQuery("#err").text('Error ');
                    jQuery('#err').html(responseText);
                    jQuery('#err').modal('show');
                } else
                    jQuery('.info').html('Resubmitted');
            });
        }
    });
};
