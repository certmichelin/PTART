/**
 * Add the CSRF token for each ajax call.
 * Require jQuery Cookie plugin.
 */
$.ajaxSetup({
    beforeSend: function(xhr, settings) {
        xhr.setRequestHeader("X-CSRFToken", $.cookie("csrftoken"));
    },
    contentType: 'application/json'
});

/**
 * Create a project.
 * 
 * @param {*} success_function function to call in case of ajax success.
 * @param {*} error_function function to call in case of ajax failure.
 * @param {*} name Project name.
 * @param {*} scope Project scope.
 */
function ajaxCreateProject(success_function, error_function, name, scope){
    $.ajax({
        url: "/api/projects/",
        data: '{"name":"' + name + '","scope":"' + scope + '"}',
        type: 'POST',
        success: success_function,
        error: error_function
    });
}

/**
 * Update a project.
 * 
 * @param {*} success_function function to call in case of ajax success.
 * @param {*} error_function function to call in case of ajax failure.
 * @param {*} id Project ID.
 * @param {*} name Project name.
 * @param {*} scope Project scope.
 */
function ajaxUpdateProject(success_function, error_function, id, name, scope){
    $.ajax({
        url: "/api/project/" + id,
        data: '{"name":"' + name + '","scope":"' + scope + '"}',
        type: 'PUT',
        success: success_function,
        error: error_function
    });
}

/**
 * Delete a project.
 * 
 * @param {*} success_function function to call in case of ajax success.
 * @param {*} error_function function to call in case of ajax failure.
 * @param {*} id Project id.
 */
function ajaxDeleteProject(success_function, error_function, id){
    $.ajax({
        url: "/api/project/" + id,
        type: 'DELETE',
        success: success_function,
        error: error_function
    });
}

/*
function sync(target) {
    $("#response").html("(Saving..)");
    timeout = setTimeout( function() {

        send(target);
    }, 2000);
}



function send(target) {
    switch(target) {
        case "flag":
            var title = JSON.stringify($("#title").val());
            var note = JSON.stringify($("#note").val());
            var done = JSON.stringify(false);
            if($("#done").is(":checked"))
                done = JSON.stringify(true);
            var assessment = JSON.stringify($("#assessment").val());
            $.ajax({
                url: "/api/flag/" + $("#id").val() + "/",
                data: '{"title": '+title+', "note": '+note+', "done": '+done+', "assessment": '+assessment+'}',
                type: 'PUT',
                success: function() {
                    $("#response").html("(Saved)");
                }
            });
            break;

        case "sh0t":
            var title = JSON.stringify($("#title").val());
            var body = JSON.stringify($("#body").val());
            var assessment = JSON.stringify($("#assessment").val());
            $.ajax({
                url: "/api/sh0t/" + $("#id").val() + "/",
                data: '{"title": ' + title + ', "body": '+ body +', "assessment": ' + assessment + '}',
                type: 'PUT',
                success: function() {
                    $("#response").html("(Saved)");
                }
            });
            break;

        case "assessment":
            var name = JSON.stringify($("#name").val());
            var project = JSON.stringify($("#project").val());
            $.ajax({
                url: "/api/assessment/" + $("#id").val() + "/",
                data: '{"name": ' + name + ', "project": ' + project + '}',
                type: 'PUT',
                success: function() {
                    $("#response").html("(Saved)");
                }
            });
            break;

        case "project":
            var name = JSON.stringify($("#name").val());
            $.ajax({
                url: "/api/project/" + $("#id").val() + "/",
                data: '{"name": ' + name + ' }',
                type: 'PUT',
                success: function() {
                    $("#response").html("(Saved)");
                }
            });
            break;

        case "template":
            var name = JSON.stringify($("#name").val());
            var body = JSON.stringify($("#body").val());
            $.ajax({
                url: "/api/template/" + $("#id").val() + "/",
                data: '{"name": ' + name + ', "body": '+ body +' }',
                type: 'PUT',
                success: function() {
                    $("#response").html("(Saved)");
                }
            });
            break;

        case "case_master":
            var name = JSON.stringify($("#name").val());
            var description = JSON.stringify($("#description").val());
            var order = JSON.stringify($("#order").val());
            var module = JSON.stringify($("#module_master").val())
            $.ajax({
                url: "/api/case-master/" + $("#id").val() + "/",
                data: '{"name": ' + name + ', "description": '+ description + ' , "order": ' + order + ', "module":' + module +' }',
                type: 'PUT',
                success: function() {
                    $("#response").html("(Saved)");
                }
            });
            break;

        case "module_master":
            var name = JSON.stringify($("#name").val());
            var description = JSON.stringify($("#description").val());
            var order = JSON.stringify($("#order").val());
            var methodology = JSON.stringify($("#methodology_master").val())
            $.ajax({
                url: "/api/module-master/" + $("#id").val() + "/",
                data: '{"name": ' + name + ', "description": '+ description + ' , "order": ' + order + ', "methodology":' + methodology +' }',
                type: 'PUT',
                success: function() {
                    $("#response").html("(Saved)");
                }
            });
            break;

        case "methodology_master":
            var name = JSON.stringify($("#name").val());
            var description = JSON.stringify($("#description").val());
            var order = JSON.stringify($("#order").val());
            $.ajax({
                url: "/api/methodology-master/" + $("#id").val() + "/",
                data: '{"name": ' + name + ', "description": '+ description + ' , "order": ' + order +' }',
                type: 'PUT',
                success: function() {
                    $("#response").html("(Saved)");
                }
            });
            break;

        default:
            alert("Invalid target");
    }
}
*/