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
        url: "/api/project/" + id + "/",
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
 * @param {*} projectId Project ID.
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
        url: "/api/assessment/" + id + "/",
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
 * Update a sh0t.
 * 
 * @param {*} success_function function to call in case of ajax success.
 * @param {*} error_function function to call in case of ajax failure.
 * @param {*} id Sh0t id.
 * @param {*} severity Sh0t severity.
 * @param {*} title Sh0t title.
 * @param {*} body Sh0t body.
 * @param {*} assessmentId  Assessment id.
 */
function ajaxUpdateSh0t(success_function, error_function, id, severity, title, body, assessmentId){
    $.ajax({
        url: "/api/sh0t/" + id + "/",
        data: '{"severity":' + JSON.stringify(severity)+ ',"title":' + JSON.stringify(title)+ ',"body":' + JSON.stringify(body) + ',"assessment":' + JSON.stringify(assessmentId) + '}',
        type: 'PUT',
        success: success_function,
        error: error_function
    });
}

/**
 * Delete a sh0t.
 * 
 * @param {*} success_function function to call in case of ajax success.
 * @param {*} error_function function to call in case of ajax failure.
 * @param {*} id Sh0t id.
 */
function ajaxDeleteSh0t(success_function, error_function, id){
    $.ajax({
        url: "/api/sh0t/" + id,
        type: 'DELETE',
        success: success_function,
        error: error_function
    });
}

/**
 * Upload a screenshot for a sh0t.
 * 
 * @param {*} success_function function to call in case of ajax success.
 * @param {*} error_function function to call in case of ajax failure.
 * @param {*} data Base64 image to upload.
 * @param {*} shotId Sh0t id.
 */
function ajaxUploadScreenshot(success_function, error_function, data, shotId){
    $.ajax({
        url: "/api/screenshots/",
        data: '{"screenshot": ' + JSON.stringify(data) + ', "sh0t": ' + JSON.stringify(shotId) + ' }',
        type: 'POST',
        success: success_function,
        error: error_function
    });
}

/**
 * Delete a screenshot.
 * 
 * @param {*} success_function function to call in case of ajax success.
 * @param {*} error_function function to call in case of ajax failure.
 * @param {*} id Screenshot id.
 */
function ajaxDeleteScreenshot(success_function, error_function, id){
    $.ajax({
        url: "/api/screenshot/" + id,
        type: 'DELETE',
        success: success_function,
        error: error_function
    });
}

/**
 * Create a flag.
 * 
 * @param {*} success_function function to call in case of ajax success.
 * @param {*} error_function function to call in case of ajax failure.
 * @param {*} name Flag name.
 * @param {*} note Flag note.
 * @param {*} assessmentId Assessment ID.
 */
function ajaxCreateFlag(success_function, error_function, title, note, assessmentId){
    $.ajax({
        url: "/api/flags/",
        data: '{"title":' + JSON.stringify(title) + ',"note":' + JSON.stringify(note) + ',"assessment":'+ JSON.stringify(assessmentId) + '}',
        type: 'POST',
        success: success_function,
        error: error_function
    });
}

/**
 * Update a flag.
 * 
 * @param {*} success_function function to call in case of ajax success.
 * @param {*} error_function function to call in case of ajax failure.
 * @param {*} name Flag id.
 * @param {*} name Flag name.
 * @param {*} note Flag note.
 * @param {*} done Flag status.
 * @param {*} assessmentId Assessment ID.
 */
function ajaxUpdateFlag(success_function, error_function, id, title, note, done, assessmentId){
    $.ajax({
        url: "/api/flag/" + id + "/",
        data: '{"title":' + JSON.stringify(title) + ',"note":' + JSON.stringify(note) + ',"done":'+ JSON.stringify(done) + ',"assessment":'+ JSON.stringify(assessmentId) + '}',
        type: 'PUT',
        success: success_function,
        error: error_function
    });
}

/**
 * Delete a flag.
 * 
 * @param {*} success_function function to call in case of ajax success.
 * @param {*} error_function function to call in case of ajax failure.
 * @param {*} id Flag id.
 */
function ajaxDeleteFlag(success_function, error_function, id){
    $.ajax({
        url: "/api/flag/" + id,
        type: 'DELETE',
        success: success_function,
        error: error_function
    });
}

/**
 * Get a template
 * 
 * @param {*} success_function function to call in case of ajax success.
 * @param {*} error_function function to call in case of ajax failure.
 * @param {*} id Template id.
 */
function ajaxGetTemplate(success_function, error_function, id){
    $.ajax({
        url: "/api/template/" + id,
        type: 'GET',
        success: success_function,
        error: error_function
    })
}

/**
 * Create a template.
 * 
 * @param {*} success_function function to call in case of ajax success.
 * @param {*} error_function function to call in case of ajax failure.
 * @param {*} severity Template severity.
 * @param {*} name Template name.
 * @param {*} body Template body.
 */
function ajaxCreateTemplate(success_function, error_function, severity, name, body){
    $.ajax({
        url: "/api/templates/",
        data: '{"severity":' + JSON.stringify(severity)+ ',"name":' + JSON.stringify(name)+ ',"body":' + JSON.stringify(body) + '}',
        type: 'POST',
        success: success_function,
        error: error_function
    });
}

/**
 * Update a template.
 * 
 * @param {*} success_function function to call in case of ajax success.
 * @param {*} error_function function to call in case of ajax failure.
 * @param {*} id Template id.
 * @param {*} severity Template severity.
 * @param {*} name Template name.
 * @param {*} body Template body.
 */
function ajaxUpdateTemplate(success_function, error_function, id, severity, name, body){
    $.ajax({
        url: "/api/template/" + id + "/",
        data: '{"severity":' + JSON.stringify(severity)+ ',"name":' + JSON.stringify(name)+ ',"body":' + JSON.stringify(body) + '}',
        type: 'PUT',
        success: success_function,
        error: error_function
    });
}

/**
 * Delete a template.
 * 
 * @param {*} success_function function to call in case of ajax success.
 * @param {*} error_function function to call in case of ajax failure.
 * @param {*} id Template id.
 */
function ajaxDeleteTemplate(success_function, error_function, id){
    $.ajax({
        url: "/api/template/" + id,
        type: 'DELETE',
        success: success_function,
        error: error_function
    });
}

/**
 * Create a methodology.
 * 
 * @param {*} success_function function to call in case of ajax success.
 * @param {*} error_function function to call in case of ajax failure.
 * @param {*} name Methodology name.
 * @param {*} description Methodology description.
 */
function ajaxCreateMethodology(success_function, error_function, name, description){
    $.ajax({
        url: "/api/methodologies/",
        data: '{"name":' + JSON.stringify(name)+ ',"description":' + JSON.stringify(description) + '}',
        type: 'POST',
        success: success_function,
        error: error_function
    });
}

/**
 * Update a methodology.
 * 
 * @param {*} success_function function to call in case of ajax success.
 * @param {*} error_function function to call in case of ajax failure.
 * @param {*} id Methodology id.
 * @param {*} name Methodology name.
 * @param {*} description Methodology description.
 */
function ajaxUpdateMethodology(success_function, error_function, id, name, description){
    $.ajax({
        url: "/api/methodology/" + id + "/",
        data: '{"name":' + JSON.stringify(name)+ ',"description":' + JSON.stringify(description) + '}',
        type: 'PUT',
        success: success_function,
        error: error_function
    });
}

/**
 * Delete a methodology.
 * 
 * @param {*} success_function function to call in case of ajax success.
 * @param {*} error_function function to call in case of ajax failure.
 * @param {*} id Methodology id.
 */
function ajaxDeleteMethodology(success_function, error_function, id){
    $.ajax({
        url: "/api/methodology/" + id,
        type: 'DELETE',
        success: success_function,
        error: error_function
    });
}

/**
 * Create a module.
 * 
 * @param {*} success_function function to call in case of ajax success.
 * @param {*} error_function function to call in case of ajax failure.
 * @param {*} name Module name.
 * @param {*} description Module description.
 * @param {*} methodology Module methodology.
 */
function ajaxCreateModule(success_function, error_function, name, description, methodology){
    $.ajax({
        url: "/api/modules/",
        data: '{"name":' + JSON.stringify(name)+ ',"description":' + JSON.stringify(description) + ',"methodology":' + JSON.stringify(methodology) + '}',
        type: 'POST',
        success: success_function,
        error: error_function
    });
}

/**
 * Update a module.
 * 
 * @param {*} success_function function to call in case of ajax success.
 * @param {*} error_function function to call in case of ajax failure.
 * @param {*} id Module id.
 * @param {*} name Module name.
 * @param {*} description Module description.
 * @param {*} methodology Module methodology.
 */
function ajaxUpdateModule(success_function, error_function, id, name, description, methodology){
    $.ajax({
        url: "/api/module/" + id + "/",
        data: '{"name":' + JSON.stringify(name)+ ',"description":' + JSON.stringify(description)+ ',"methodology":' + JSON.stringify(methodology) + '}',
        type: 'PUT',
        success: success_function,
        error: error_function
    });
}

/**
 * Delete a module.
 * 
 * @param {*} success_function function to call in case of ajax success.
 * @param {*} error_function function to call in case of ajax failure.
 * @param {*} id Module id.
 */
function ajaxDeleteModule(success_function, error_function, id){
    $.ajax({
        url: "/api/module/" + id,
        type: 'DELETE',
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