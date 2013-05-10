var MODAL = function(config) {
    var modalName = config.modalName,
        modalContent = config.content;
    modalTitle = config.modalTitle;

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
    jQuery('body').append(modalDiv);

};