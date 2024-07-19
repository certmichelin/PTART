// Created by STRd6
// MIT License
// jquery.paste_image_reader.js

//This code is incomplete. You need to develop the pasteImageReader which apply the result to DOM/
//Exemple : 
// $("html").pasteImageReader(function (results) {
//     var dataURL = results.dataURL;
//     $("#screenshotData").text(dataURL);
//     $("#screenshot").attr("src",dataURL);
// });

(function ($) {
    var defaults;
    $.event.fix =
        (function (originalFix) {
            return function (event) {
                event = originalFix.apply(this, arguments);
                if (event.type.indexOf("copy") === 0 || event.type.indexOf("paste") === 0) {
                    event.clipboardData = event.originalEvent.clipboardData;
                }
                return event;
            };
        })($.event.fix);

    defaults = {
        callback: $.noop,
        matchType: /image.*/
    };

    return ($.fn.pasteImageReader = function (options) {
        if (typeof options === "function") {
            options = {
                callback: options
            };
        }
        options = $.extend({}, defaults, options);
        return this.each(function () {
            var $this, element;
            element = this;
            $this = $(this);
            return $this.bind("paste", function (event) {
                var clipboardData, found;
                found = false;
                clipboardData = event.clipboardData;
                return Array.prototype.forEach.call(clipboardData.types, function (type, i) {
                    var file, reader;
                    if (found) {
                        return;
                    }
                    if (
                        type.match(options.matchType) ||
                        clipboardData.items[i].type.match(options.matchType)
                    ) {
                        file = clipboardData.items[i].getAsFile();
                        reader = new FileReader();
                        reader.onload = function (evt) {
                            return options.callback.call(element, {
                                dataURL: evt.target.result,
                                event: evt,
                                file: file,
                                name: file.name
                            });
                        };
                        reader.readAsDataURL(file);
                        return (found = true);
                    }
                });
            });
        });
    });
})(jQuery);

/* ---------------------------------------------------------------------------------------------------- */
/* -------------------------------------- Drag and Drop Screenshot ------------------------------------ */
/* ---------------------------------------------------------------------------------------------------- */
var apiRoute = "/api/screenshot/png/";

//Standard AllowDrop function.
function allowDrop(ev) {
    ev.preventDefault();
}

function convertIdToMarkdown(id) {
    rootUrl = `${window.location.protocol}//${window.location.hostname}${window.location.port ? ':' + window.location.port : ''}`;
    return "![ptart_screenshot](" + rootUrl + apiRoute + id.replace("screenshot_link_", "").replace("screenshot_", "") + "/)";
}

function convertMarkdownToId(md){
    rootUrl = `${window.location.protocol}//${window.location.hostname}${window.location.port ? ':' + window.location.port : ''}`;
    return md.replace("![ptart_screenshot](" + rootUrl + apiRoute,"").replace("/)", "");
}

//Screenshot drag start function.
function dragScreenshotStart(ev) {
    ev.dataTransfer.setData("text/plain", convertIdToMarkdown(ev.target.id));
    $('#deleteZone').text("Drop here to delete")
    $("#deleteZone").attr('class', 'btn btn-success mb-4');
}

//Delete screenshot drag stop function.
function dragScreenshotStop(ev) {
    $('#deleteZone').text("Delete Screenshot Zone")
    $("#deleteZone").attr('class', 'btn btn-outline-danger mb-4');
}

/* --------------------------------------------------------------------------------------------------- */
/* ------------------------------- Default behavior for create screenshot ---------------------------- */
/* --------------------------------------------------------------------------------------------------- */
//Rendering for paste image operation.
$("html").pasteImageReader(function (results) {
    var dataURL = results.dataURL;
    $("#uploadMessage").hide();
    $("#screenshotData").val(dataURL);
    $("#screenshot").attr("src", dataURL);
});

//Reset screenshot modal after image upload
function resetScreenshotModal() {
    $("#pushScreenshotModal").modal('toggle');
    $("#screenshotData").val("");
    $("#screenshotCaption").val("");
    $("#screenshot").attr("src", "");
    $("#uploadMessage").show();
}

//Add screenshot.
function addScreenshot() {
    var dataURL = $("#screenshotData").val();
    var caption = $("#screenshotCaption").val();
    if (dataURL !== "") {
        //Manage ID.
        var id = $('#screenshotMaxId').val();
        $('#screenshotMaxId').val(parseInt(id) + 1);

        //add screenshot to gallery
        createScreenshot(id, dataURL, caption, $('.screenshot').length);

        //Build context menu for screenshots.
        buildContextMenuForScreenshots("screenshot_link_" + id, id, $('.screenshot').length - 1, $('.screenshot').length, screenshotMoveUpCallback, screenshotMoveDownCallback);
        var previousBlock = $("#screenshot_link_" + id).prev('.screenshot');
        if(previousBlock.length) {
            previousBlock.contextMenu('destroy');
            buildContextMenuForScreenshots(previousBlock.attr('id'),previousBlock.attr('data-screenshot-id'),parseInt(previousBlock.attr('data-screenshot-order'), 10), $('.screenshot').length ,screenshotMoveUpCallback,screenshotMoveDownCallback);
        }

        //Reset modal
        resetScreenshotModal();
    } else {
        bootbox.alert("No screenshot is pasted!")
    }
}

//Create screenshot in the screenshot container.
function createScreenshot(id, dataURL, caption, order) {
    $('#screenshots').append($('<a>', { id: "screenshot_link_" + id, href: dataURL, caption: caption, "data-screenshot-id" : id, "data-screenshot-order":order, class: "screenshot", "data-fancybox": "gallery", ondragstart: "dragScreenshotStart(event)", ondragend: "dragScreenshotStop(event)", "data-toggle" : "tooltip",  "data-placement":"left" , "title" : caption}).append($('<img>', { id: "screenshot_" + id, src: dataURL, caption: caption, class: "screenshot_data screenshot_gallery"})));
    $("#screenshot_link_" + id).tooltip();
}

/* --------------------------------------------------------------------------------------------------- */
/* ------------------------------- Default behavior for delete screenshot ---------------------------- */
/* --------------------------------------------------------------------------------------------------- */
//Delete screenshot drop function.
function dropDeleteScreenshot(ev) {
    ev.preventDefault();
    id = convertMarkdownToId(ev.dataTransfer.getData("text/plain"));
    currentBlock = $("#screenshot_link_" + id);
    var count = $('.screenshot').length - 1;
    $(".screenshot").each(function() {
        var order = parseInt($(this).attr('data-screenshot-order'),10)
        if ( order > parseInt(currentBlock.attr('data-screenshot-order'),10)) {
            var newOrder = order - 1;
            $(this).attr('data-screenshot-order', newOrder);

            //Rebuild context menu.
            $(this).contextMenu('destroy');
            buildContextMenuForScreenshots($(this).attr('id'),$(this).attr('data-screenshot-id'),newOrder,count,screenshotMoveUpCallback,screenshotMoveDownCallback);
        } else if (order == (parseInt(currentBlock.attr('data-screenshot-order'),10) - 1)) {
            $(this).contextMenu('destroy');
            buildContextMenuForScreenshots($(this).attr('id'),$(this).attr('data-screenshot-id'),order,count,screenshotMoveUpCallback,screenshotMoveDownCallback);
        }
    });
    removeScreenshot(id);
    $('#deleteZone').text("Delete Screenshot Zone");
    $("#deleteZone").attr('class', 'btn btn-outline-danger mb-4');
}

//remove screenshot from HTML container.
function removeScreenshot(id) {
    $("#screenshot_link_" + id).remove();
}

/* --------------------------------------------------------------------------------------------------- */
/* ------------------------------- Default behavior for screenshot reorder --------------------------- */
/* --------------------------------------------------------------------------------------------------- */
function buildContextMenuForScreenshots(screenshotBlockId, screenshotId, order, count, moveUpCallback, moveDownCallback) {
    $(function(){
        $.contextMenu({
            selector: '#' + screenshotBlockId,
            items: {
                "up": {name: "Move Up", icon: "fa-arrow-up", disabled: (order == 0), callback: function(key, options) {       
                    moveUpCallback(screenshotBlockId, screenshotId, order - 1);
                }},
                "down": {name: "Move Down", icon: "fa-arrow-down", disabled: (order == count - 1), callback: function(key, options) {
                    moveDownCallback(screenshotBlockId, screenshotId, order + 1);
                }}
            }
        });
    }); 
}

function screenshotMoveUpCallback(screenshotBlockId, screenshotId, order) {
    var currentBlock = $("#" + screenshotBlockId);
    var previousBlock = currentBlock.prev('.screenshot');

    //Change data-order attribute for both elements.
    currentBlock.attr('data-screenshot-order', order);
    previousBlock.attr('data-screenshot-order', order + 1);

    //Change the order in the DOM.
    moveUpScreenshot(screenshotBlockId);
    
    //Update Context menu.
    currentBlock.contextMenu('destroy');
    previousBlock.contextMenu('destroy');

    var count = $('.screenshot').length;
    buildContextMenuForScreenshots(currentBlock.attr('id'),currentBlock.attr('data-screenshot-id'),parseInt(currentBlock.attr('data-screenshot-order'), 10),count,screenshotMoveUpCallback,screenshotMoveDownCallback);
    buildContextMenuForScreenshots(previousBlock.attr('id'),previousBlock.attr('data-screenshot-id'),parseInt(previousBlock.attr('data-screenshot-order'), 10),count,screenshotMoveUpCallback,screenshotMoveDownCallback);
}

function screenshotMoveDownCallback(screenshotBlockId, screenshotId, order) {
    var currentBlock = $("#" + screenshotBlockId);
    var nextBlock = currentBlock.next('.screenshot');

    //Change data-order attribute for both elements.
    currentBlock.attr('data-screenshot-order', order);
    nextBlock.attr('data-screenshot-order', order - 1);

    //Change the order in the DOM.
    moveDownScreenshot(screenshotBlockId);
    
    //Update Context menu.
    currentBlock.contextMenu('destroy');
    nextBlock.contextMenu('destroy');

    var count = $('.screenshot').length;
    buildContextMenuForScreenshots(currentBlock.attr('id'),currentBlock.attr('data-screenshot-id'),parseInt(currentBlock.attr('data-screenshot-order'), 10),count, screenshotMoveUpCallback,screenshotMoveDownCallback);
    buildContextMenuForScreenshots(nextBlock.attr('id'),nextBlock.attr('data-screenshot-id'),parseInt(nextBlock.attr('data-screenshot-order'), 10),count,screenshotMoveUpCallback,screenshotMoveDownCallback);
}

function moveUpScreenshot(blockId) {
    var currentBlock = $("#" + blockId);
    var previousBlock = currentBlock.prev('.screenshot');
    if (previousBlock.length) {
        currentBlock.insertBefore(previousBlock);
    }
}

function moveDownScreenshot(blockId) {
    var currentBlock = $("#" + blockId);
    var nextBlock = currentBlock.next('.screenshot');
    if (nextBlock.length) {
        currentBlock.insertAfter(nextBlock);
    }
}

/**
 * Enable Bootstrap menu for screenshots.
 */
function activeBootstapMenuForScreenshots(moveUpCallback, moveDownCallback) {
    $('.screenshot').each(function() {
        buildContextMenuForScreenshots($(this).attr('id'), $(this).attr('data-screenshot-id'), parseInt($(this).attr('data-screenshot-order'), 10), $('.screenshot').length, moveUpCallback, moveDownCallback);
    });
}

