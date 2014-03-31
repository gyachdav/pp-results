var JOB_RUN = function(config) {
    var reqid = config.reqid;
    var original_date = new Date(config.original_date);
    var target_div = config.target_div;
    if (!reqid)
        reqid = 2;

    var jobStatus = function() {
        responseText = jQuery('div');
        jQuery(responseText).append(jQuery('<h3/>').text('Job submitted to the queue').addClass(''));

        jQuery(responseText).append(jQuery('<span/>').attr('id', 'job_state').text('Current status: waiting for processing'));
        jQuery(responseText).append('<br/>');
        jQuery(responseText).append('<br/>');

        jQuery(responseText).append(jQuery('<span/>').attr('id', 'results_link').text("Use the following link to check on the job's status. "));
        jQuery(responseText).append('<br/>');
        jQuery(responseText).append(jQuery('<a/>').attr('target', '_blank').attr('href', 'get_results?req_id=' + jobEncId).append(jQuery('<span />').text('http://ppopen.informatik.tu-muenchen.de/get_results?req_id=' + jobEncId)));
        jQuery(responseText).append('<br/>');
        jQuery(responseText).append('<br/>');

        var pp_notify_email_button = jQuery('<input>').attr('type', 'button').attr('id', 'ppnotify_email_button').attr('value', 'update notification email').addClass('btn btn-primary');

        jQuery(responseText).append(jQuery('<div/>').attr('id', 'pp_notify_email_div').text("OPTIONAL: enter your email address and we will notify you when the results are ready")
            .append('<br/>')
            .append(jQuery('<input>').attr('type', 'text').attr('id', 'ppnotify_email'))
            .append('<br/>')
            .append(pp_notify_email_button)
            .append('<br/>'));

        jQuery(responseText).append(jQuery('<span/>').text("This window can safely be closed without affecting processing. "));
        jQuery(responseText).append('<br/>');

        pp_notify_email_button.click(function() {
            var ppnotify_email = jQuery("#ppnotify_email").val();
            var _t_posting = jQuery.post('api/modify_ppnotify_email', {
                ppnotify_email: ppnotify_email,
                req_id: jobEncId
            }, function(data) {
                status = data.status;
                reason = data.reason;
                reason_text = data.reason_text;
                jobId = data.job_id;
                jobEncId = data.job_enc_id;
            }, 'json');

            _t_posting.done(function() {
                jQuery("#pp_notify_email_div").empty().addClass('success').text("Email notification will be sent to " + ppnotify_email);
            });
        });


        var interval_count = 0;
        var interval_length = 3000; // set in miliseconds
        var interval_count_max = 8 * 60 * 60 * interval_length; // Stop after 8 hours (set in miliseconds)
        var intervalID;

        var monitor_state = function() {
            jQuery.post('api/job_status', {
                reqid: jobEncId
            }, function(state_data) {
                jobState = state_data.job_state;
                batchID = state_data.job_state;
                batchState = state_data.job_batch_state;

                if (jobState == 'completed') {
                    clearInterval(intervalID);
                    showJobCompletedScreen(jobEncId, 'job-monitor-feedback');
                    return;
                }

                jQuery('#job_state').text('Current status: ' + capitaliseFirstLetter(batchState));
            }, 'json');
            interval_count++;
            if ((interval_count * interval_length) > interval_count_max)
                clearInterval(intervalID);

        }
        var intervalID = window.setInterval(monitor_state, interval_length);
        jQuery('#mainModal').on('hide', function() {
            if (intervalID)
                clearInterval(intervalID);
        });
        jQuery("#mainModalLabel").text('Submission ' + capitaliseFirstLetter(status));
        jQuery('#modal-container').html(responseText);
        jQuery('#mainModal').modal('show');

    };

    var jobRunModal = new MODAL({
        modalName: 'JobRunDialogue',
        modalTitle: "Resubmit Job",
        content: "Are you sure you would like to resubmit this job? Resubmitting will make the results unavialable until the job completed",
        modalDialog: true
    });

    var jobRunDiv = jQuery('<div/>').addClass('alert alert-error')
        .append(jQuery('<div/>').text('The results for this sequence were pre-calculated on ' + original_date.toDateString() + ' and are older than 3 months. We recommend that you resubmit this job to get a more up-to-date (and possibly more accurate) result. You can resubmit the job by pressing the "Resubmit Job" button.'))
        .append(jQuery('<div/>')).append(
            jQuery('<a/>')
            .attr('id', 'JobRunDialogueBttn')
            .attr('href', '#JobRunDialogue')
            .addClass('btn btn-danger')
            .text('Resubmit Job'));

    jQuery('.' + target_div).append(jobRunDiv);

    jQuery("#JobRunDialogueBttn").on("click", function() {
        jobRunModal.getModalDiv().modal('toggle');
    });

    jobRunModal.getModalDiv().on("hide", function() {
        if (jobRunModal.getDialogueAnswer() !== "-1" && jobRunModal.getDialogueAnswer() == true) {

            var status, reason, reason_text;

            var posting = jjQuery.post('api/job_status', {
                reqid: jobEncId
            }, function(data) {

                // var posting = jQuery.post('api/job_resubmit', {
                //     reqid: reqid
                // }

                console.log('success');
                status = data.status;
                reason = data.reason;
                reason_text = data.reason_text;
            }, 'json');

            posting.done(function() {
                if (status != 'success') {
                    var responseText = jQuery('<div/>')
                        .html('Cannot resubmit request id ' + reqid + '. <br/><br/> Reason: ' + reason + '. <br/><br/> Please contact admin ')
                        .addClass('alert alert-error');
                    jQuery("#err").text('Error ');
                    jQuery('#err').html(responseText);
                    jQuery('#err').modal('show');
                } else {
                    jobRunModal.getModalDiv().modal('toggle');
                    jobStatus();
                    // window.location.href = '/getqueries';
                    return;
                }
            });
        }
    });
};