var MODAL = function(config) {
    var modalName = config.modalName,
        modalContent = config.content;
    modalTitle = config.modalTitle;
    modalDialog = config.modalDialog;

    var dialog_answer = -1;

    var modalDiv = jQuery('<div />')
        .addClass("modal hide fade")
        .attr("id", modalName)
        .attr('tabindex', -1)
        .attr("role", "dialog")
        .attr("aria-labelledby", modalName + "Label")
        .attr("aria-hidden", true)
        .append(jQuery('<div />').addClass('modal-header')
        .append(jQuery('<button/>')
        .addClass('close modalClose')
        .attr('type', 'button')
        .attr("aria-hidden", "true")
        .attr("data-dismiss", "modal")
        .html('x'))
        .append(jQuery('<h3/>').attr("id", modalName + "Label").text(modalTitle)))
        .append(jQuery('<div />').addClass("modal-body")
        .append(jQuery('<div />').attr("id", modalName + "Container")))
        .append(jQuery('<div />').addClass("modal-footer")
        .append(jQuery('<button/>')
        .addClass('bttn modalClose')
        .attr("data-target", "#" + modalName)
        .attr("aria-hidden", "true")
        .attr("data-dismiss", "modal")
        .html('Close')));
    jQuery('#modal-container').append(modalDiv);


    if (modalDialog){
        tmp_div = jQuery(".modal-footer");
        tmp_div.empty();
        tmp_div.append(jQuery('<button/>')
        .addClass('btn btn-primary')
        .attr('id','btn-yes')
        .html('Yes'));
        tmp_div.append(jQuery('<button/>')
        .addClass('btn btn-danger')
        .attr('id','btn-no')
        .html('No'));


        jQuery('#btn-yes').on('click', function(e) {
            e.preventDefault();
            dialog_answer = true;
            modalDiv.modal('toggle');
        });


        jQuery('#btn-no').on('click', function(e) {
            e.preventDefault();
            dialog_answer = false;
            modalDiv.modal('toggle');
        });

        jQuery('.close').on('click', function(){
            dialog_answer = -1;
        });

    }

    if (modalContent)
        jQuery('.modal-body').text(modalContent);

    return{
        getDialogueAnswer: function getDialogueAnswer(){
            return    dialog_answer;
        }, 
        getModalDiv: function getModalDiv () {
           return    modalDiv;
        }
    }

};