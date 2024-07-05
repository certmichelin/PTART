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
//Standard AllowDrop function.
function allowDrop(ev) {
    ev.preventDefault();
}

//Screenshot drag start function.
function dragScreenshotStart(ev) {
    ev.dataTransfer.setData("text/plain", ev.target.id.replace("screenshot_link_", "").replace("screenshot_", ""));
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
        createScreenshot(id, dataURL, caption);
        resetScreenshotModal();
    } else {
        bootbox.alert("No screenshot is pasted!")
    }
}

//Create screenshot in the screenshot container.
function createScreenshot(id, dataURL, caption) {
    $('#screenshots').append($('<a>', { id: "screenshot_link_" + id, href: dataURL, caption: caption, class: "screenshot", "data-fancybox": "gallery", ondragstart: "dragStart(event)", ondragend: "dragStop(event)", "data-toggle" : "tooltip",  "data-placement":"left" , "title" : caption}).append($('<img>', { id: "screenshot_" + id, src: dataURL, caption: caption, class: "screenshot_data screenshot_gallery"})));
    $("#screenshot_link_" + id).tooltip();
}

/* --------------------------------------------------------------------------------------------------- */
/* ------------------------------- Default behavior for delete screenshot ---------------------------- */
/* --------------------------------------------------------------------------------------------------- */
//Delete screenshot drop function.
function dropDeleteScreenshot(ev) {
    ev.preventDefault();
    id = ev.dataTransfer.getData("text/plain");
    removeScreenshot(id);
    $('#deleteZone').text("Delete Screenshot Zone")
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

