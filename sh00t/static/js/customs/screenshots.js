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
    $("#screenshot").attr("src", "");
    $("#uploadMessage").show();
}

//Add screenshot.
function addScreenshot() {
    var dataURL = $("#screenshotData").val()
    if (dataURL !== "") {
        //Manage ID.
        var id = $('#screenshotMaxId').val();
        $('#screenshotMaxId').val(parseInt(id) + 1);

        //add screenshot to gallery
        createScreenshot(id, dataURL);
        resetScreenshotModal();
    } else {
        bootbox.alert("No screenshot is pasted!")
    }
}

//Create screenshot in the screenshot cointainer.
function createScreenshot(id, dataURL) {
    $('#screenshots').append($('<a>', { href: dataURL, class: "screenshot", "data-fancybox": "gallery" }).append($('<img>', { id: "screenshot_" + id, src: dataURL, class: "screenshot_data screenshot_gallery", draggable: "true", ondragstart: "dragStart(event)", ondragend: "dragStop(event)" })));
}


//Delete screenshot allow drop function.
function allowDrop(ev) {
    ev.preventDefault();
}

//Delete screenshot drag start function.
function dragStart(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
    $('#deleteZone').text("Drop here to delete")
    $("#deleteZone").attr('class', 'btn btn-success mb-4');
}

//Delete screenshot drag stop function.
function dragStop(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
    $('#deleteZone').text("Delete Screenshot Zone")
    $("#deleteZone").attr('class', 'btn btn-outline-danger mb-4');
}

//Delete screenshot drag stop function.
function drop(ev) {
    ev.preventDefault();
    id = ev.dataTransfer.getData("text");
    removeScreenshot(id);
}

//remove screenshot from HTML container.
function removeScreenshot(id) {
    $("#" + id).parent().remove();
}