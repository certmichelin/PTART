/**
 * Go back to the previous page with reload.
 */
function goBackWithRefresh(event) {
    if ('referrer' in document) {
        window.location = document.referrer;
    } else {
        window.history.back();
    }
}

function urlSearchParams(name) {
    var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
    if (results == null) {
        return null;
    }
    else {
        return decodeURI(results[1]) || 0;
    }
}

/**
 * Toggle all elements of a list.
 */
function toggle(source) {
    checkboxes = document.getElementsByName('selection');
    for (var i in checkboxes)
        checkboxes[i].checked = source.checked;
}

/**
 * Enable automatically all the tooltips.
 */
$(function () {
    $('[data-toggle="tooltip"]').tooltip();
})
