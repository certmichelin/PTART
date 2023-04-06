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

//Create screenshot in the screenshot cointainer.
function createScreenshot(id, dataURL, caption) {
    $('#screenshots').append($('<a>', { id: "screenshot_link_" + id, href: dataURL, caption: caption, class: "screenshot", "data-fancybox": "gallery", ondragstart: "dragStart(event)", ondragend: "dragStop(event)", "data-toggle" : "tooltip",  "data-placement":"left" , "title" : caption}).append($('<img>', { id: "screenshot_" + id, src: dataURL, caption: caption, class: "screenshot_data screenshot_gallery"})));
    $("#screenshot_link_" + id).tooltip();
}


//Delete screenshot allow drop function.
function allowDrop(ev) {
    ev.preventDefault();
}

//Delete screenshot drag start function.
function dragStart(ev) {
    ev.dataTransfer.setData("text/plain", ev.target.id.replace("screenshot_link_", "").replace("screenshot_", ""));
    $('#deleteZone').text("Drop here to delete")
    $("#deleteZone").attr('class', 'btn btn-success mb-4');
}

//Delete screenshot drag stop function.
function dragStop(ev) {
    $('#deleteZone').text("Delete Screenshot Zone")
    $("#deleteZone").attr('class', 'btn btn-outline-danger mb-4');
}

//Delete screenshot drag stop function.
function drop(ev) {
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