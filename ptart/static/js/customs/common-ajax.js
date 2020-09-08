/**
 * Add the CSRF token for each ajax call.
 * Require jQuery Cookie plugin.
 */
$.ajaxSetup({
    beforeSend: function (xhr, settings) {
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
 * @param {*} introduction Project introduction.
 * @param {*} conclusion Project conclusion.
 * @param {*} pentesters Project pentesters.
 * @param {*} viewers Project viewers.
 */
function ajaxCreateProject(success_function, error_function, name, introduction, conclusion, pentesters, viewers) {
    $.ajax({
        url: "/api/projects/",
        data: '{"name":' + JSON.stringify(name) + ',"introduction":' + JSON.stringify(introduction) + ',"conclusion":' + JSON.stringify(conclusion) + ',"pentesters":' + convertArrayToJSON(pentesters) + ',"viewers":' + convertArrayToJSON(viewers) + '}',
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
 * @param {*} introduction Project introduction.
 * @param {*} conclusion Project conclusion.
 * @param {*} pentesters Project pentesters.
 * @param {*} viewers Project viewers.
 */
function ajaxUpdateProject(success_function, error_function, id, name, introduction, conclusion, pentesters, viewers) {
    $.ajax({
        url: "/api/project/" + id + "/",
        data: '{"name":' + JSON.stringify(name) + ',"introduction":' + JSON.stringify(introduction) + ',"conclusion":' + JSON.stringify(conclusion) + ',"pentesters":' + convertArrayToJSON(pentesters) + ',"viewers":' + convertArrayToJSON(viewers) + '}',
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
function ajaxDeleteProject(success_function, error_function, id) {
    $.ajax({
        url: "/api/project/" + id + "/",
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
function ajaxCreateAssessment(success_function, error_function, name, projectId) {
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
function ajaxUpdateAssessment(success_function, error_function, id, name, projectID) {
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
function ajaxDeleteAssessment(success_function, error_function, id) {
    $.ajax({
        url: "/api/assessment/" + id + "/",
        type: 'DELETE',
        success: success_function,
        error: error_function
    });
}

/**
 * Create a hit.
 * 
 * @param {*} success_function function to call in case of ajax success.
 * @param {*} error_function function to call in case of ajax failure.
 * @param {*} severity Hit severity.
 * @param {*} title Hit title.
 * @param {*} asset Hit asset.
 * @param {*} body Hit body.
 * @param {*} labels Hit labels.
 * @param {*} displayable True if the label will be displayed in report.
 * @param {*} assessmentId  Assessment id.
 */
function ajaxCreateHit(success_function, error_function, severity, title, asset, body, displayable, labels, assessmentId) {
    $.ajax({
        url: "/api/hits/",
        data: '{"severity":' + JSON.stringify(severity) + ',"title":' + JSON.stringify(title) + ',"asset":' + JSON.stringify(asset) + ',"body":' + JSON.stringify(body) + ',"displayable":' + JSON.stringify(displayable) + ',"labels":' + convertArrayToJSON(labels) + ',"assessment":' + JSON.stringify(assessmentId) + '}',
        type: 'POST',
        success: success_function,
        error: error_function
    });
}

/**
 * Update a hit.
 * 
 * @param {*} success_function function to call in case of ajax success.
 * @param {*} error_function function to call in case of ajax failure.
 * @param {*} id Hit id.
 * @param {*} severity Hit severity.
 * @param {*} title Hit title.
 * @param {*} asset Hit asset.
 * @param {*} body Hit body.
 * @param {*} displayable True if the label will be displayed in report.
 * @param {*} labels Hit labels.
 * @param {*} assessmentId  Assessment id.
 */
function ajaxUpdateHit(success_function, error_function, id, severity, title, asset, body, displayable, labels, assessmentId) {
    $.ajax({
        url: "/api/hit/" + id + "/",
        data: '{"severity":' + JSON.stringify(severity) + ',"title":' + JSON.stringify(title) + ',"asset":' + JSON.stringify(asset) + ',"body":' + JSON.stringify(body) + ',"displayable":' + JSON.stringify(displayable) + ',"labels":' + convertArrayToJSON(labels) + ',"assessment":' + JSON.stringify(assessmentId) + '}',
        type: 'PUT',
        success: success_function,
        error: error_function
    });
}

/**
 * Delete a hit.
 * 
 * @param {*} success_function function to call in case of ajax success.
 * @param {*} error_function function to call in case of ajax failure.
 * @param {*} id Hit id.
 */
function ajaxDeleteHit(success_function, error_function, id) {
    $.ajax({
        url: "/api/hit/" + id + "/",
        type: 'DELETE',
        success: success_function,
        error: error_function
    });
}

/**
 * Create a label.
 * 
 * @param {*} success_function function to call in case of ajax success.
 * @param {*} error_function function to call in case of ajax failure.
 * @param {*} name Label title.
 * @param {*} color Label color.
 */
function ajaxCreateLabel(success_function, error_function, title, color) {
    $.ajax({
        url: "/api/labels/",
        data: '{"title":' + JSON.stringify(title) + ',"color":' + JSON.stringify(color) + '}',
        type: 'POST',
        success: success_function,
        error: error_function
    });
}

/**
 * Update a label.
 * 
 * @param {*} success_function function to call in case of ajax success.
 * @param {*} error_function function to call in case of ajax failure.
 * @param {*} id Label id.
 * @param {*} title Label title.
 * @param {*} color Label color.
 */
function ajaxUpdateLabel(success_function, error_function, id, title, color) {
    $.ajax({
        url: "/api/label/" + id + "/",
        data: '{"title":' + JSON.stringify(title) + ',"color":' + JSON.stringify(color) + '}',
        type: 'PUT',
        success: success_function,
        error: error_function
    });
}

/**
 * Delete a label.
 * 
 * @param {*} success_function function to call in case of ajax success.
 * @param {*} error_function function to call in case of ajax failure.
 * @param {*} id Label id.
 */
function ajaxDeleteLabel(success_function, error_function, id) {
    $.ajax({
        url: "/api/label/" + id + "/",
        type: 'DELETE',
        success: success_function,
        error: error_function
    });
}

/**
 * Create a comment.
 * 
 * @param {*} success_function function to call in case of ajax success.
 * @param {*} error_function function to call in case of ajax failure.
 * @param {*} comment Comment Text.
 * @param {*} hitId Id of the hit.
 */
function ajaxCreateComment(success_function, error_function, comment, hitId) {
    $.ajax({
        url: "/api/hit/" + hitId + "/comments/",
        data: '{"text":' + JSON.stringify(comment) + '}',
        type: 'POST',
        success: success_function,
        error: error_function
    });
}

/**
 * Delete a comment.
 * 
 * @param {*} success_function function to call in case of ajax success.
 * @param {*} error_function function to call in case of ajax failure.
 * @param {*} id Comment id.
 */
function ajaxDeleteComment(success_function, error_function, id) {
    $.ajax({
        url: "/api/comment/" + id + "/",
        type: 'DELETE',
        success: success_function,
        error: error_function
    });
}

/**
 * Upload a screenshot for a hit.
 * 
 * @param {*} success_function function to call in case of ajax success.
 * @param {*} error_function function to call in case of ajax failure.
 * @param {*} data Base64 image to upload.
 * @param {*} caption Image caption.
 * @param {*} hitId Hit id.
 */
function ajaxUploadScreenshot(success_function, error_function, data, caption, hitId) {
    $.ajax({
        url: "/api/screenshots/",
        data: '{"screenshot": ' + JSON.stringify(data) + ', "caption": ' + JSON.stringify(caption) + ', "hit": ' + JSON.stringify(hitId) + ' }',
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
function ajaxDeleteScreenshot(success_function, error_function, id) {
    $.ajax({
        url: "/api/screenshot/" + id + "/",
        type: 'DELETE',
        success: success_function,
        error: error_function
    });
}

/**
 * Upload an attachment for a hit.
 * 
 * @param {*} success_function function to call in case of ajax success.
 * @param {*} error_function function to call in case of ajax failure.
 * @param {*} data Base64 attachment to upload.
 * @param {*} name Attachment file name.
 * @param {*} hitId Hit id.
 */
function ajaxUploadAttachment(success_function, error_function, data, name, hitId) {
    $.ajax({
        url: "/api/attachments/",
        data: '{"attachment": ' + JSON.stringify(data) + ', "attachment_name": ' + JSON.stringify(name) + ', "hit": ' + JSON.stringify(hitId) + ' }',
        type: 'POST',
        success: success_function,
        error: error_function
    });
}

/**
 * Delete an attachment.
 * 
 * @param {*} success_function function to call in case of ajax success.
 * @param {*} error_function function to call in case of ajax failure.
 * @param {*} id Attachment id.
 */
function ajaxDeleteAttachment(success_function, error_function, id) {
    $.ajax({
        url: "/api/attachment/" + id + "/",
        type: 'DELETE',
        success: success_function,
        error: error_function
    });
}

/**
 * Compute the cvss value a screenshot for a hit.
 * 
 * @param {*} success_function function to call in case of ajax success.
 * @param {*} error_function function to call in case of ajax failure.
 * @param {*} attackVector Attack vector.
 * @param {*} attackComplexity Attack complexity.
 * @param {*} privilegeRequired Privilege required for the attack.
 * @param {*} userInteraction Attack need user interaction.
 * @param {*} scope Scope is changed or not.
 * @param {*} confidentiality Confidentiality.
 * @param {*} integrity Integrity.
 * @param {*} availability Availability.
 */
function ajaxComputeCVSSv3(success_function, error_function, attackVector, attackComplexity, privilegeRequired, userInteraction, scope, confidentiality, integrity, availability) {
    $.ajax({
        url: "/api/cvss/",
        data: '{"attack_vector": ' + JSON.stringify(attackVector) + ', "attack_complexity": ' + JSON.stringify(attackComplexity) + ', "privilege_required": ' + JSON.stringify(privilegeRequired) + ', "user_interaction": ' + JSON.stringify(userInteraction) + ', "scope": ' + JSON.stringify(scope) + ', "confidentiality": ' + JSON.stringify(confidentiality) + ', "integrity": ' + JSON.stringify(integrity) + ', "availability": ' + JSON.stringify(availability) + ' }',
        type: 'POST',
        success: success_function,
        error: error_function
    });
}

/**
 * Compute the cvss and add it to the hit.
 * 
 * @param {*} success_function function to call in case of ajax success.
 * @param {*} error_function function to call in case of ajax failure.
 * @param {*} hitId Hit ID.
 * @param {*} attackVector Attack vector.
 * @param {*} attackComplexity Attack complexity.
 * @param {*} privilegeRequired Privilege required for the attack.
 * @param {*} userInteraction Attack need user interaction.
 * @param {*} scope Scope is changed or not.
 * @param {*} confidentiality Confidentiality.
 * @param {*} integrity Integrity.
 * @param {*} availability Availability.
 */
function ajaxAddCVSSv3(success_function, error_function, hitId, attackVector, attackComplexity, privilegeRequired, userInteraction, scope, confidentiality, integrity, availability) {
    $.ajax({
        url: "/api/hit/" + hitId + "/cvss/",
        data: '{"attack_vector": ' + JSON.stringify(attackVector) + ', "attack_complexity": ' + JSON.stringify(attackComplexity) + ', "privilege_required": ' + JSON.stringify(privilegeRequired) + ', "user_interaction": ' + JSON.stringify(userInteraction) + ', "scope": ' + JSON.stringify(scope) + ', "confidentiality": ' + JSON.stringify(confidentiality) + ', "integrity": ' + JSON.stringify(integrity) + ', "availability": ' + JSON.stringify(availability) + ' }',
        type: 'POST',
        success: success_function,
        error: error_function
    });
}

/**
 * Remove the CVSS value from the hit.
 * 
 * @param {*} success_function function to call in case of ajax success.
 * @param {*} error_function function to call in case of ajax failure.
 * @param {*} hitId Hit ID.
 */
function ajaxRemoveCVSSv3(success_function, error_function, hitId) {
    $.ajax({
        url: "/api/hit/" + hitId + "/cvss/",
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
 * @param {*} name Flag asset.
 * @param {*} note Flag note.
 * @param {*} assessmentId Assessment ID.
 * @param {*} assigneeId Assignee ID.
 */
function ajaxCreateFlag(success_function, error_function, title, asset, note, assessmentId, assigneeId) {
    $.ajax({
        url: "/api/flags/",
        data: '{"title":' + JSON.stringify(title) + ',"asset":' + JSON.stringify(asset) + ',"note":' + JSON.stringify(note) + ',"done": "False", "assessment":' + JSON.stringify(assessmentId) + ',"assignee":' + JSON.stringify(assigneeId) + '}',
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
 * @param {*} name Flag asset.
 * @param {*} note Flag note.
 * @param {*} done Flag status.
 * @param {*} assessmentId Assessment ID.
 * @param {*} assigneeId Assignee ID.
 */
function ajaxUpdateFlag(success_function, error_function, id, title, asset, note, done, assessmentId, assigneeId) {
    $.ajax({
        url: "/api/flag/" + id + "/",
        data: '{"title":' + JSON.stringify(title) + ',"asset":' + JSON.stringify(asset) + ',"note":' + JSON.stringify(note) + ',"done":' + JSON.stringify(done) + ',"assessment":' + JSON.stringify(assessmentId) + ',"assignee":' + JSON.stringify(assigneeId) + '}',
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
function ajaxDeleteFlag(success_function, error_function, id) {
    $.ajax({
        url: "/api/flag/" + id + "/",
        type: 'DELETE',
        success: success_function,
        error: error_function
    });
}

/**
 * Mark flag as done.
 * 
 * @param {*} success_function function to call in case of ajax success.
 * @param {*} error_function function to call in case of ajax failure.
 * @param {*} id Flag id.
 */
function ajaxMarkFlagAsDone(success_function, error_function, id) {
    $.ajax({
        url: "/api/flag/" + id + "/complete/",
        type: 'POST',
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
function ajaxGetTemplate(success_function, error_function, id) {
    $.ajax({
        url: "/api/template/" + id + "/",
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
 * @param {*} asset Template asset.
 * @param {*} body Template body.
 */
function ajaxCreateTemplate(success_function, error_function, severity, name, asset, body) {
    $.ajax({
        url: "/api/templates/",
        data: '{"severity":' + JSON.stringify(severity) + ',"name":' + JSON.stringify(name) + ',"asset":' + JSON.stringify(asset) + ',"body":' + JSON.stringify(body) + '}',
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
 * @param {*} name Template asset.
 * @param {*} body Template body.
 */
function ajaxUpdateTemplate(success_function, error_function, id, severity, name, asset, body) {
    $.ajax({
        url: "/api/template/" + id + "/",
        data: '{"severity":' + JSON.stringify(severity) + ',"name":' + JSON.stringify(name) + ',"asset":' + JSON.stringify(asset) + ',"body":' + JSON.stringify(body) + '}',
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
function ajaxDeleteTemplate(success_function, error_function, id) {
    $.ajax({
        url: "/api/template/" + id + "/",
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
function ajaxCreateMethodology(success_function, error_function, name, description) {
    $.ajax({
        url: "/api/methodologies/",
        data: '{"name":' + JSON.stringify(name) + ',"description":' + JSON.stringify(description) + '}',
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
function ajaxUpdateMethodology(success_function, error_function, id, name, description) {
    $.ajax({
        url: "/api/methodology/" + id + "/",
        data: '{"name":' + JSON.stringify(name) + ',"description":' + JSON.stringify(description) + '}',
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
function ajaxDeleteMethodology(success_function, error_function, id) {
    $.ajax({
        url: "/api/methodology/" + id + "/",
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
function ajaxCreateModule(success_function, error_function, name, description, methodology) {
    $.ajax({
        url: "/api/modules/",
        data: '{"name":' + JSON.stringify(name) + ',"description":' + JSON.stringify(description) + ',"methodology":' + JSON.stringify(methodology) + '}',
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
function ajaxUpdateModule(success_function, error_function, id, name, description, methodology) {
    $.ajax({
        url: "/api/module/" + id + "/",
        data: '{"name":' + JSON.stringify(name) + ',"description":' + JSON.stringify(description) + ',"methodology":' + JSON.stringify(methodology) + '}',
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
function ajaxDeleteModule(success_function, error_function, id) {
    $.ajax({
        url: "/api/module/" + id + "/",
        type: 'DELETE',
        success: success_function,
        error: error_function
    });
}

/**
 * Create a case.
 * 
 * @param {*} success_function function to call in case of ajax success.
 * @param {*} error_function function to call in case of ajax failure.
 * @param {*} name Case name.
 * @param {*} description Case description.
 * @param {*} module Case module.
 */
function ajaxCreateCase(success_function, error_function, name, description, module) {
    $.ajax({
        url: "/api/cases/",
        data: '{"name":' + JSON.stringify(name) + ',"description":' + JSON.stringify(description) + ',"module":' + JSON.stringify(module) + '}',
        type: 'POST',
        success: success_function,
        error: error_function
    });
}

/**
 * Update a case.
 * 
 * @param {*} success_function function to call in case of ajax success.
 * @param {*} error_function function to call in case of ajax failure.
 * @param {*} id Case id.
 * @param {*} name Case name.
 * @param {*} description Case description.
 * @param {*} module Case module.
 */
function ajaxUpdateCase(success_function, error_function, id, name, description, module) {
    $.ajax({
        url: "/api/case/" + id + "/",
        data: '{"name":' + JSON.stringify(name) + ',"description":' + JSON.stringify(description) + ',"module":' + JSON.stringify(module) + '}',
        type: 'PUT',
        success: success_function,
        error: error_function
    });
}

/**
 * Delete a case.
 * 
 * @param {*} success_function function to call in case of ajax success.
 * @param {*} error_function function to call in case of ajax failure.
 * @param {*} id Case id.
 */
function ajaxDeleteCase(success_function, error_function, id) {
    $.ajax({
        url: "/api/case/" + id + "/",
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
function ajaxLoadFlagsFromModule(success_function, error_function, moduleId, assessmentId) {
    $.ajax({
        url: "/api/module/" + moduleId + "/load/" + assessmentId + "/",
        type: 'POST',
        success: success_function,
        error: error_function
    });
}

/**
 * Create a host.
 * 
 * @param {*} success_function function to call in case of ajax success.
 * @param {*} error_function function to call in case of ajax failure.
 * @param {*} ip Host ip.
 * @param {*} hostname Host hostname.
 * @param {*} os Host os.
 * @param {*} notes Host notes.
 * @param {*} project Host project.
 */
function ajaxCreateHost(success_function, error_function, ip, hostname, os, notes, project) {
    $.ajax({
        url: "/api/hosts/",
        data: '{"ip":' + JSON.stringify(ip) + ',"hostname":' + JSON.stringify(hostname) + ',"os":' + JSON.stringify(os) + ',"notes":' + JSON.stringify(notes) + ',"project":' + JSON.stringify(project) + '}',
        type: 'POST',
        success: success_function,
        error: error_function
    });
}

/**
 * Update a host.
 * 
 * @param {*} success_function function to call in case of ajax success.
 * @param {*} error_function function to call in case of ajax failure.
 * @param {*} id Host id.
 * @param {*} ip Host ip.
 * @param {*} hostname Host hostname.
 * @param {*} os Host os.
 * @param {*} notes Host notes.
 * @param {*} project Host project.
 */
function ajaxUpdateHost(success_function, error_function, id, ip, hostname, os, notes, project) {
    $.ajax({
        url: "/api/host/" + id + "/",
        data: '{"ip":' + JSON.stringify(ip) + ',"hostname":' + JSON.stringify(hostname) + ',"os":' + JSON.stringify(os) + ',"notes":' + JSON.stringify(notes) + ',"project":' + JSON.stringify(project) + '}',
        type: 'PUT',
        success: success_function,
        error: error_function
    });
}

/**
 * Delete a host.
 * 
 * @param {*} success_function function to call in case of ajax success.
 * @param {*} error_function function to call in case of ajax failure.
 * @param {*} id Host id.
 */
function ajaxDeleteHost(success_function, error_function, id) {
    $.ajax({
        url: "/api/host/" + id + "/",
        type: 'DELETE',
        success: success_function,
        error: error_function
    });
}

/**
 * Create a service.
 * 
 * @param {*} success_function function to call in case of ajax success.
 * @param {*} error_function function to call in case of ajax failure.
 * @param {*} port Service port.
 * @param {*} protocol Service protocol.
 * @param {*} name Service name.
 * @param {*} version Service version.
 * @param {*} banner Service banner.
 * @param {*} host Service host.
 */
function ajaxCreateService(success_function, error_function, port, protocol, name, version, banner, host) {
    $.ajax({
        url: "/api/services/",
        data: '{"port":' + JSON.stringify(port) + ',"protocol":' + JSON.stringify(protocol) + ',"name":' + JSON.stringify(name) + ',"version":' + JSON.stringify(version) + ',"banner":' + JSON.stringify(banner) + ',"host":' + JSON.stringify(host) + '}',
        type: 'POST',
        success: success_function,
        error: error_function
    });
}

/**
 * Update a service.
 * 
 * @param {*} success_function function to call in case of ajax success.
 * @param {*} error_function function to call in case of ajax failure.
 * @param {*} id Service id.
 * @param {*} port Service port.
 * @param {*} protocol Service protocol.
 * @param {*} name Service name.
 * @param {*} version Service version.
 * @param {*} banner Service banner.
 * @param {*} host Service host.
 */
function ajaxUpdateService(success_function, error_function, id, port, protocol, name, version, banner, host) {
    $.ajax({
        url: "/api/service/" + id + "/",
        data: '{"port":' + JSON.stringify(port) + ',"protocol":' + JSON.stringify(protocol) + ',"name":' + JSON.stringify(name) + ',"version":' + JSON.stringify(version) + ',"banner":' + JSON.stringify(banner) + ',"host":' + JSON.stringify(host) + '}',
        type: 'PUT',
        success: success_function,
        error: error_function
    });
}

/**
 * Delete a service.
 * 
 * @param {*} success_function function to call in case of ajax success.
 * @param {*} error_function function to call in case of ajax failure.
 * @param {*} id Service id.
 */
function ajaxDeleteService(success_function, error_function, id) {
    $.ajax({
        url: "/api/service/" + id + "/",
        type: 'DELETE',
        success: success_function,
        error: error_function
    });
}

/**
 * Convert array to JSON string.
 * 
 * @param {*} array Array to convert.
 */
function convertArrayToJSON(array) {
    var arrayJson = "[";
    if (array !== null) {
        var prefix = "";
        array.forEach(function (value) {
            arrayJson += prefix + value;
            prefix = ",";
        });
    }
    arrayJson += "]";
    return arrayJson;
}
