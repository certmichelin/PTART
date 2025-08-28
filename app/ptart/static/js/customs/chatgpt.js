var chatgpt_modal = $("#chatgptModal");
chatgpt_modal.draggable({
    handle: ".modal-header",
});

/**
 * Close Chat GPT console.
 */
function chatgpt_close_modal() {
    chatgpt_modal.modal('hide');
}

/**
 * Chat GPT request.
 */
function chatgpt_request() {
    //Lock the interface.
    $("#chatgpt_question").prop("readonly", true);
    $("#chatgpt_response").prop("readonly", true);
    $("#chatgpt_request_button").prop('disabled', true);
    ajaxChatGpt(chatgpt_request_success, chatgpt_request_failure, $("#chatgpt_question").val());
}

/**
 * Chat GPT request success callback.
 */
function chatgpt_request_success(data) {
    $("#chatgpt_question").prop("readonly", false);
    $("#chatgpt_response").prop("readonly", false);
    $("#chatgpt_request_button").prop('disabled', false);
    $("#chatgpt_response").removeClass("is-invalid");
    $("#chatgpt_response").val(data.trimStart());
}

/**
 * Chat GPT request failure callback.
 */
function chatgpt_request_failure(data) {
    $("#chatgpt_question").prop("readonly", false);
    $("#chatgpt_response").prop("readonly", false);
    $("#chatgpt_request_button").prop('disabled', false);
    $("#chatgpt_response").addClass("is-invalid");
    $("#chatgpt_response").val("");
}
