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
        data: '{"name":' + JSON.stringify(name) + ',"scope":' + JSON.stringify(scope) + '}',
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
        data: '{"name":' + JSON.stringify(name) + ',"scope":' + JSON.stringify(name) + '}',
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

/**
 * Create an assessment.
 * 
 * @param {*} success_function function to call in case of ajax success.
 * @param {*} error_function function to call in case of ajax failure.
 * @param {*} name Assessment name.
 * @param {*} scope Project ID.
 */
function ajaxCreateAssessment(success_function, error_function, name, projectId){
    $.ajax({
        url: "/api/assessments/",
        data: '{"name":' + JSON.stringify(name) + ',"project":' + JSON.stringify(projectId) + '}',
        type: 'POST',
        success: success_function,
        error: error_function
    });
}

/**
 * Update an assessment.
 * 
 * @param {*} success_function function to call in case of ajax success.
 * @param {*} error_function function to call in case of ajax failure.
 * @param {*} id Assessment ID.
 * @param {*} name Assessment name.
 * @param {*} projectID Project ID.
 */
function ajaxUpdateAssessment(success_function, error_function, id, name, projectID){
    $.ajax({
        url: "/api/assessment/" + id,
        data: '{"name":' + JSON.stringify(name) + ',"project":' + JSON.stringify(projectID) + '}',
        type: 'PUT',
        success: success_function,
        error: error_function
    });
}

/**
 * Delete an assessment.
 * 
 * @param {*} success_function function to call in case of ajax success.
 * @param {*} error_function function to call in case of ajax failure.
 * @param {*} id Assessment id.
 */
function ajaxDeleteAssessment(success_function, error_function, id){
    $.ajax({
        url: "/api/assessment/" + id,
        type: 'DELETE',
        success: success_function,
        error: error_function
    });
}

/**
 * Create a sh0t.
 * 
 * @param {*} success_function function to call in case of ajax success.
 * @param {*} error_function function to call in case of ajax failure.
 * @param {*} severity Sh0t severity.
 * @param {*} title Sh0t title.
 * @param {*} body Sh0t body.
 * @param {*} assessmentId  Assessment id.
 */
function ajaxCreateSh0t(success_function, error_function, severity, title, body, assessmentId){
    $.ajax({
        url: "/api/sh0ts/",
        data: '{"severity":' + JSON.stringify(severity)+ ',"title":' + JSON.stringify(title)+ ',"body":' + JSON.stringify(body) + ',"assessment":' + JSON.stringify(assessmentId) + '}',
        type: 'POST',
        success: success_function,
        error: error_function
    });
}

/**
 * Load flags from module to an assessment.
 * 
 * @param {*} success_function function to call in case of ajax success.
 * @param {*} error_function function to call in case of ajax failure.
 * @param {*} moduleId Module id.
 * @param {*} assessmentId Assessment id.
 */
function ajaxLoadFlagsFromModule(success_function, error_function, moduleId, assessmentId){
    $.ajax({
        url: "/api/module/" + moduleId + "/load/" + assessmentId + "/",
        type: 'POST',
        success: success_function,
        error: error_function
    });
}