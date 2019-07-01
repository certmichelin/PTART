/**
 * Manage attachement. 
 */
function openAttachment(event) {
    var input = event.target;
    var reader = new FileReader();
    reader.fileName = input.files[0].name;
    reader.onload = function (readerEvt) {
        //Manage ID.
        var id = $('#attachmentMaxId').val();
        $('#attachmentMaxId').val(parseInt(id) + 1);

        //Add attachment to the list.
        $('#attachments').append($('<div>', { class: "mb-2" }).append($('<i>', { class: "far fa-file" })).append($('<a>', { id: "attachment_link_" + id, filename: readerEvt.target.fileName, href: reader.result, class: "attachment_gallery" }).text(" " + readerEvt.target.fileName + " ")).append($('<i>', { class: "fa fa-close", onclick: "$(this).parent().remove();" })));
        $('#AttachmentUpload').val('')
    };
    reader.readAsDataURL(input.files[0]);
}

//remove attachment from HTML container.
function removeAttachment(id) {
    $("#attachment_link_" + id).parent().remove();
}