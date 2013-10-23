var JOB_RUN = function(config) {
    var reqid = config.reqid;
    var original_date = config.original_date;
    if (!reqid)
        reqid = 2;

    var jobRunModal = new MODAL({
        modalName: 'JobRunDialogue',
        modalTitle: "Resubmit Job",
        content: "Are you sure you would like to resubmit this job to the processing queue?",
        modalDialog: true
    });

    var jobRunDiv = jQuery('div').addClass('container job-run')
        .append(jQuery(div).text('The results for this sequence were generated on ' + original_date + ' and are older than 3 months. We recommend that you re run this job for a more up to date (and possibly accurate) result.'))
        .append(jQuery(div).jQuery('a')
            .attr('id', 'JobRunDialogueBttn')
            .attr('href', '#JobRunDialogue')
            .addClass('href', 'btn btn-danger')
            .text('Resubmit Job')
    );

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
}