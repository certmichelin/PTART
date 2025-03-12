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
 * @param {*} successFunction Function to call in case of ajax success.
 * @param {*} errorFunction Function to call in case of ajax failure.
 * @param {*} name Project name.
 * @param {*} start_date Project start date.
 * @param {*} end_date Project end date.
 * @param {*} executive_summary Project executive_summary.
 * @param {*} engagement_overview Project engagement overview.
 * @param {*} conclusion Project conclusion.
 * @param {*} scope Project scope.
 * @param {*} client Project client.
 * @param {*} cvss_type Project cvss type (3 or 4).
 * @param {*} methodologies Project methodologies.
 * @param {*} tools Project tools.
 * @param {*} pentesters Project pentesters.
 * @param {*} viewers Project viewers.
 */
function ajaxCreateProject(successFunction, errorFunction, name, start_date, end_date, executive_summary, engagement_overview, conclusion, scope, client, cvss_type, methodologies, tools, pentesters, viewers) {
    $.ajax({
        url: "/api/projects/",
        data: '{"name":' + JSON.stringify(name) + ',"start_date":' + JSON.stringify(start_date) + ',"end_date":' + JSON.stringify(end_date) + ',"executive_summary":' + JSON.stringify(executive_summary) + ',"engagement_overview":' + JSON.stringify(engagement_overview) + ',"conclusion":' + JSON.stringify(conclusion) + ',"scope":' + JSON.stringify(scope) + ',"client":' + JSON.stringify(client) + ',"cvss_type":' + JSON.stringify(cvss_type) + ',"methodologies":' + convertArrayToJSON(methodologies) + ',"tools":' + convertArrayToJSON(tools) + ',"pentesters":' + convertArrayToJSON(pentesters) + ',"viewers":' + convertArrayToJSON(viewers) + '}',
        type: 'POST',
        success: successFunction,
        error: errorFunction
    });
}

/**
 * Update a project.
 * 
 * @param {*} successFunction Function to call in case of ajax success.
 * @param {*} errorFunction Function to call in case of ajax failure.
 * @param {*} id Project ID.
 * @param {*} name Project name.
 * @param {*} start_date Project start date.
 * @param {*} end_date Project end date.
 * @param {*} executive_summary Project executive_summary.
 * @param {*} engagement_overview Project engagement overview.
 * @param {*} conclusion Project conclusion.
 * @param {*} scope Project scope.
 * @param {*} client Project client.
 * @param {*} cvss_type Project cvss type (3 or 4).
 * @param {*} methodologies Project methodologies.
 * @param {*} tools Project tools.
 * @param {*} pentesters Project pentesters.
 * @param {*} viewers Project viewers.
 * @param {*} archived True if the project is archived.
 */
function ajaxUpdateProject(successFunction, errorFunction, id, name, start_date, end_date, executive_summary, engagement_overview, conclusion, scope, client, cvss_type, methodologies, tools, pentesters, viewers, archived) {
    $.ajax({
        url: "/api/project/" + id + "/",
        data: '{"name":' + JSON.stringify(name) + ',"start_date":' + JSON.stringify(start_date) + ',"end_date":' + JSON.stringify(end_date) + ',"executive_summary":' + JSON.stringify(executive_summary) + ',"engagement_overview":' + JSON.stringify(engagement_overview) + ',"conclusion":' + JSON.stringify(conclusion) + ',"scope":' + JSON.stringify(scope) + ',"client":' + JSON.stringify(client) + ',"cvss_type":' + JSON.stringify(cvss_type) + ',"archived":' + JSON.stringify(archived) + ',"methodologies":' + convertArrayToJSON(methodologies) + ',"tools":' + convertArrayToJSON(tools) + ',"pentesters":' + convertArrayToJSON(pentesters) + ',"viewers":' + convertArrayToJSON(viewers) + '}',
        type: 'PUT',
        success: successFunction,
        error: errorFunction
    });
}

/**
 * Delete a project.
 * 
 * @param {*} successFunction Function to call in case of ajax success.
 * @param {*} errorFunction Function to call in case of ajax failure.
 * @param {*} id Project id.
 */
function ajaxDeleteProject(successFunction, errorFunction, id) {
    $.ajax({
        url: "/api/project/" + id + "/",
        type: 'DELETE',
        success: successFunction,
        error: errorFunction
    });
}

/**
 * Create an assessment.
 * 
 * @param {*} successFunction Function to call in case of ajax success.
 * @param {*} errorFunction Function to call in case of ajax failure.
 * @param {*} name Assessment name.
 * @param {*} projectId Project ID.
 */
function ajaxCreateAssessment(successFunction, errorFunction, name, projectId) {
    $.ajax({
        url: "/api/assessments/",
        data: '{"name":' + JSON.stringify(name) + ',"project":' + JSON.stringify(projectId) + '}',
        type: 'POST',
        success: successFunction,
        error: errorFunction
    });
}

/**
 * Update an assessment.
 * 
 * @param {*} successFunction Function to call in case of ajax success.
 * @param {*} errorFunction Function to call in case of ajax failure.
 * @param {*} id Assessment ID.
 * @param {*} name Assessment name.
 * @param {*} projectID Project ID.
 */
function ajaxUpdateAssessment(successFunction, errorFunction, id, name, projectID) {
    $.ajax({
        url: "/api/assessment/" + id + "/",
        data: '{"name":' + JSON.stringify(name) + ',"project":' + JSON.stringify(projectID) + '}',
        type: 'PUT',
        success: successFunction,
        error: errorFunction
    });
}

/**
 * Delete an assessment.
 * 
 * @param {*} successFunction Function to call in case of ajax success.
 * @param {*} errorFunction Function to call in case of ajax failure.
 * @param {*} id Assessment id.
 */
function ajaxDeleteAssessment(successFunction, errorFunction, id) {
    $.ajax({
        url: "/api/assessment/" + id + "/",
        type: 'DELETE',
        success: successFunction,
        error: errorFunction
    });
}

/**
 * Create a hit.
 * 
 * @param {*} successFunction Function to call in case of ajax success.
 * @param {*} errorFunction Function to call in case of ajax failure.
 * @param {*} severity Hit severity.
 * @param {*} title Hit title.
 * @param {*} asset Hit asset.
 * @param {*} body Hit body.
 * @param {*} remediation Hit remediation.
 * @param {*} labels Hit labels.
 * @param {*} status Hit status.
 * @param {*} fix_complexity Hit fix complexity (N/D, High, Medium, Low)
 * @param {*} assessmentId  Assessment id.
 */
function ajaxCreateHit(successFunction, errorFunction, severity, title, asset, body, remediation, status, fix_complexity, labels, assessmentId) {
    $.ajax({
        url: "/api/hits/",
        data: '{"severity":' + JSON.stringify(severity) + ',"title":' + JSON.stringify(title) + ',"asset":' + JSON.stringify(asset) + ',"body":' + JSON.stringify(body) + ',"remediation":' + JSON.stringify(remediation) + ',"status":' + JSON.stringify(status) + ',"fix_complexity":' + JSON.stringify(fix_complexity) + ',"labels":' + convertArrayToJSON(labels) + ',"assessment":' + JSON.stringify(assessmentId) + '}',
        type: 'POST',
        success: successFunction,
        error: errorFunction
    });
}

/**
 * Update a hit.
 * 
 * @param {*} successFunction Function to call in case of ajax success.
 * @param {*} errorFunction Function to call in case of ajax failure.
 * @param {*} id Hit id.
 * @param {*} severity Hit severity.
 * @param {*} title Hit title.
 * @param {*} asset Hit asset.
 * @param {*} body Hit body.
 * @param {*} remediation Hit remediation.
 * @param {*} status Hit status.
 * @param {*} fix_complexity Hit fix complexity (N/D, High, Medium, Low)
 * @param {*} labels Hit labels.
 * @param {*} assessmentId  Assessment id.
 */
function ajaxUpdateHit(successFunction, errorFunction, id, severity, title, asset, body, remediation, status, fix_complexity, labels, assessmentId) {
    $.ajax({
        url: "/api/hit/" + id + "/",
        data: '{"severity":' + JSON.stringify(severity) + ',"title":' + JSON.stringify(title) + ',"asset":' + JSON.stringify(asset) + ',"body":' + JSON.stringify(body) + ',"remediation":' + JSON.stringify(remediation) + ',"status":' + JSON.stringify(status) + ',"fix_complexity":' + JSON.stringify(fix_complexity) + ',"labels":' + convertArrayToJSON(labels) + ',"assessment":' + JSON.stringify(assessmentId) + '}',
        type: 'PUT',
        success: successFunction,
        error: errorFunction
    });
}

/**
 * Delete a hit.
 * 
 * @param {*} successFunction Function to call in case of ajax success.
 * @param {*} errorFunction Function to call in case of ajax failure.
 * @param {*} id Hit id.
 */
function ajaxDeleteHit(successFunction, errorFunction, id) {
    $.ajax({
        url: "/api/hit/" + id + "/",
        type: 'DELETE',
        success: successFunction,
        error: errorFunction
    });
}

/**
 * Create a label.
 * 
 * @param {*} successFunction Function to call in case of ajax success.
 * @param {*} errorFunction Function to call in case of ajax failure.
 * @param {*} name Label title.
 * @param {*} color Label color.
 */
function ajaxCreateLabel(successFunction, errorFunction, title, color) {
    $.ajax({
        url: "/api/labels/",
        data: '{"title":' + JSON.stringify(title) + ',"color":' + JSON.stringify(color) + '}',
        type: 'POST',
        success: successFunction,
        error: errorFunction
    });
}

/**
 * Update a label.
 * 
 * @param {*} successFunction Function to call in case of ajax success.
 * @param {*} errorFunction Function to call in case of ajax failure.
 * @param {*} id Label id.
 * @param {*} title Label title.
 * @param {*} deprecated True if label is deprecated.
 * @param {*} color Label color.
 */
function ajaxUpdateLabel(successFunction, errorFunction, id, title, deprecated, color) {
    $.ajax({
        url: "/api/label/" + id + "/",
        data: '{"title":' + JSON.stringify(title) + ',"deprecated":' + JSON.stringify(deprecated) + ',"color":' + JSON.stringify(color) + '}',
        type: 'PUT',
        success: successFunction,
        error: errorFunction
    });
}

/**
 * Delete a label.
 * 
 * @param {*} successFunction Function to call in case of ajax success.
 * @param {*} errorFunction Function to call in case of ajax failure.
 * @param {*} id Label id.
 */
function ajaxDeleteLabel(successFunction, errorFunction, id) {
    $.ajax({
        url: "/api/label/" + id + "/",
        type: 'DELETE',
        success: successFunction,
        error: errorFunction
    });
}

/**
 * Create a CWE List.
 * 
 * @param {*} successFunction Function to call in case of ajax success.
 * @param {*} errorFunction Function to call in case of ajax failure.
 * @param {*} version CWE list version.
 * @param {*} deprecated Label Is list is deprecated.
 */
function ajaxCreateCWEs(successFunction, errorFunction, version, deprecated) {
    $.ajax({
        url: "/api/cwes/",
        data: '{"version":' + JSON.stringify(version) + ',"deprecated":' + JSON.stringify(deprecated) + '}',
        type: 'POST',
        success: successFunction,
        error: errorFunction
    });
}

/**
 * Update a CWE list.
 * 
 * @param {*} successFunction Function to call in case of ajax success.
 * @param {*} errorFunction Function to call in case of ajax failure.
 * @param {*} id CWE list id.
 * @param {*} version CWE list version.
 * @param {*} deprecated True if CWE list is deprecated.
 */
function ajaxUpdateCWEs(successFunction, errorFunction, id, title, deprecated, color) {
    $.ajax({
        url: "/api/cwes/" + id + "/",
        data: '{"version":' + JSON.stringify(version) + ',"deprecated":' + JSON.stringify(deprecated) + '}',
        type: 'PUT',
        success: successFunction,
        error: errorFunction
    });
}

/**
 * Delete a CWE list.
 * 
 * @param {*} successFunction Function to call in case of ajax success.
 * @param {*} errorFunction Function to call in case of ajax failure.
 * @param {*} id CWE list id.
 */
function ajaxDeleteCWEs(successFunction, errorFunction, id) {
    $.ajax({
        url: "/api/cwes/" + id + "/",
        type: 'DELETE',
        success: successFunction,
        error: errorFunction
    });
}

/**
 * Create a CWE entry.
 * 
 * @param {*} successFunction Function to call in case of ajax success.
 * @param {*} errorFunction Function to call in case of ajax failure.
 * @param {*} cwe_id CWE entry visible id.
 * @param {*} name CWE item name .
 * @param {*} description CWE item description.
 * @param {*} extended_description CWE item extended description.
 * @param {*} cwes CWE list id.
 */
function ajaxCreateCWE(successFunction, errorFunction, cwe_id, name, description, extended_description, cwes) {
    $.ajax({
        url: "/api/cwe/",
        data: '{"cwe_id":' + JSON.stringify(cwe_id) + ',"name":' + JSON.stringify(name) + ',"description":' + JSON.stringify(description)+ ',"extended_description":' + JSON.stringify(extended_description)+ ',"cwes":' + JSON.stringify(cwes) + '}',
        type: 'POST',
        success: successFunction,
        error: errorFunction
    });
}

/**
 * Update a CWE entry.
 * 
 * @param {*} successFunction Function to call in case of ajax success.
 * @param {*} errorFunction Function to call in case of ajax failure.
 * @param {*} id CWE entry id.
 * @param {*} cwe_id CWE item visible id.
 * @param {*} name CWE item name .
 * @param {*} description CWE item description.
 * @param {*} extended_description CWE item extended description.
 * @param {*} cwes CWE list id.
 */
function ajaxUpdateCWE(successFunction, errorFunction, id,cwe_id, name, description, extended_description, cwes) {
    $.ajax({
        url: "/api/cwe/" + id + "/",
        data: '{"cwe_id":' + JSON.stringify(cwe_id) + ',"name":' + JSON.stringify(name) + ',"description":' + JSON.stringify(description)+ ',"extended_description":' + JSON.stringify(extended_description)+ ',"cwes":' + JSON.stringify(cwes) + '}',
        type: 'PUT',
        success: successFunction,
        error: errorFunction
    });
}

/**
 * Delete a CWE entry.
 * 
 * @param {*} successFunction Function to call in case of ajax success.
 * @param {*} errorFunction Function to call in case of ajax failure.
 * @param {*} id CWE entry id.
 */
function ajaxDeleteCWE(successFunction, errorFunction, id) {
    $.ajax({
        url: "/api/cwe/" + id + "/",
        type: 'DELETE',
        success: successFunction,
        error: errorFunction
    });
}

/**
 * Create a tool.
 * 
 * @param {*} successFunction Function to call in case of ajax success.
 * @param {*} errorFunction Function to call in case of ajax failure.
 * @param {*} name Tool name.
 * @param {*} url Tool url.
 */
function ajaxCreateTool(successFunction, errorFunction, name, url) {
    $.ajax({
        url: "/api/tools/",
        data: '{"name":' + JSON.stringify(name) + ',"url":' + JSON.stringify(url) + '}',
        type: 'POST',
        success: successFunction,
        error: errorFunction
    });
}

/**
 * Update a tool.
 * 
 * @param {*} successFunction Function to call in case of ajax success.
 * @param {*} errorFunction Function to call in case of ajax failure.
 * @param {*} id Tool id.
 * @param {*} name Tool name.
 * @param {*} deprecated True if tool is deprecated.
 * @param {*} url Tool url.
 */
function ajaxUpdateTool(successFunction, errorFunction, id, name, deprecated, url) {
    $.ajax({
        url: "/api/tool/" + id + "/",
        data: '{"name":' + JSON.stringify(name) + ',"deprecated":' + JSON.stringify(deprecated) + ',"url":' + JSON.stringify(url) + '}',
        type: 'PUT',
        success: successFunction,
        error: errorFunction
    });
}

/**
 * Delete a tool.
 * 
 * @param {*} successFunction Function to call in case of ajax success.
 * @param {*} errorFunction Function to call in case of ajax failure.
 * @param {*} id Tool id.
 */
function ajaxDeleteTool(successFunction, errorFunction, id) {
    $.ajax({
        url: "/api/tool/" + id + "/",
        type: 'DELETE',
        success: successFunction,
        error: errorFunction
    });
}

/**
 * Create a comment.
 * 
 * @param {*} successFunction Function to call in case of ajax success.
 * @param {*} errorFunction Function to call in case of ajax failure.
 * @param {*} comment Comment Text.
 * @param {*} hitId Id of the hit.
 */
function ajaxCreateComment(successFunction, errorFunction, comment, hitId) {
    $.ajax({
        url: "/api/hit/" + hitId + "/comments/",
        data: '{"text":' + JSON.stringify(comment) + '}',
        type: 'POST',
        success: successFunction,
        error: errorFunction
    });
}

/**
 * Delete a comment.
 * 
 * @param {*} successFunction Function to call in case of ajax success.
 * @param {*} errorFunction Function to call in case of ajax failure.
 * @param {*} id Comment id.
 */
function ajaxDeleteComment(successFunction, errorFunction, id) {
    $.ajax({
        url: "/api/comment/" + id + "/",
        type: 'DELETE',
        success: successFunction,
        error: errorFunction
    });
}

/**
 * Create a hit reference.
 * 
 * @param {*} successFunction Function to call in case of ajax success.
 * @param {*} errorFunction Function to call in case of ajax failure.
 * @param {*} name Hit reference name.
 * @param {*} url Hit reference url.
 * @param {*} hitId Id of the hit.
 */
function ajaxCreateHitReference(successFunction, errorFunction, name, url, hitId) {
    $.ajax({
        url: "/api/hit/" + hitId + "/references/",
        data: '{"name":' + JSON.stringify(name) + ',"url":' + JSON.stringify(url) + '}',
        type: 'POST',
        success: successFunction,
        error: errorFunction
    });
}

/**
 * Delete a hit reference.10.
 * 
 * 
 
* @param {*} successFunction Function to call in case of ajax success.
 * @param {*} errorFunction Function to call in case of ajax failure.
 * @param {*} id Hit reference id.
 */
function ajaxDeleteHitReference(successFunction, errorFunction, id) {
    $.ajax({
        url: "/api/hitreference/" + id + "/",
        type: 'DELETE',
        success: successFunction,
        error: errorFunction
    });
}

/**
 * Upload a screenshot for a hit.
 * 
 * @param {*} successFunction Function to call in case of ajax success.
 * @param {*} errorFunction Function to call in case of ajax failure.
 * @param {*} data Base64 image to upload.
 * @param {*} caption Image caption.
 * @param {*} hitId Hit id.
 */
function ajaxUploadScreenshot(successFunction, errorFunction, data, caption, hitId) {
    $.ajax({
        url: "/api/screenshots/",
        data: '{"screenshot": ' + JSON.stringify(data) + ', "caption": ' + JSON.stringify(caption) + ', "hit": ' + JSON.stringify(hitId) + ' }',
        type: 'POST',
        success: successFunction,
        error: errorFunction
    });
}

/**
 * Delete a screenshot.
 * 
 * @param {*} successFunction Function to call in case of ajax success.
 * @param {*} errorFunction Function to call in case of ajax failure.
 * @param {*} id Screenshot id.
 */
function ajaxDeleteScreenshot(successFunction, errorFunction, id) {
    $.ajax({
        url: "/api/screenshot/" + id + "/",
        type: 'DELETE',
        success: successFunction,
        error: errorFunction
    });
}

/**
 * Reorder a screenshot.
 * 
 * @param {*} successFunction Function to call in case of ajax success.
 * @param {*} errorFunction Function to call in case of ajax failure.
 * @param {*} screenshot_id ID of the screenshot.
 * @param {*} order Screenshot new order.
 */
function ajaxReorderScreenshot(successFunction, errorFunction, screenshot_id, order) {
    $.ajax({
        url: "/api/screenshot/" + screenshot_id + "/order/" + order + "/",
        data: '{}',
        type: 'PUT',
        success: successFunction,
        error: errorFunction
    });
}

/**
 * Upload a screenshot for a retest hit.
 * 
 * @param {*} successFunction Function to call in case of ajax success.
 * @param {*} errorFunction Function to call in case of ajax failure.
 * @param {*} data Base64 image to upload.
 * @param {*} caption Image caption.
 * @param {*} retestHitId Hit id.
 */
function ajaxUploadRetestScreenshot(successFunction, errorFunction, data, caption, retestHitId) {
    $.ajax({
        url: "/api/retestscreenshots/",
        data: '{"screenshot": ' + JSON.stringify(data) + ', "caption": ' + JSON.stringify(caption) + ', "retest_hit": ' + JSON.stringify(retestHitId) + ' }',
        type: 'POST',
        success: successFunction,
        error: errorFunction
    });
}

/**
 * Delete a retest hit screenshot.
 * 
 * @param {*} successFunction Function to call in case of ajax success.
 * @param {*} errorFunction Function to call in case of ajax failure.
 * @param {*} id Screenshot id.
 */
function ajaxDeleteRetestScreenshot(successFunction, errorFunction, id) {
    $.ajax({
        url: "/api/retestscreenshot/" + id + "/",
        type: 'DELETE',
        success: successFunction,
        error: errorFunction
    });
}

/**
 * Reorder a retest hit screenshot.
 * 
 * @param {*} successFunction Function to call in case of ajax success.
 * @param {*} errorFunction Function to call in case of ajax failure.
 * @param {*} id ID of the retest hit screenshot.
 * @param {*} order Screenshot new order.
 */
function ajaxReorderRetestScreenshot(successFunction, errorFunction, id, order) {
    $.ajax({
        url: "/api/retestscreenshot/" + id + "/order/" + order + "/",
        data: '{}',
        type: 'PUT',
        success: successFunction,
        error: errorFunction
    });
}

/**
 * Upload an attachment for a hit.
 * 
 * @param {*} successFunction Function to call in case of ajax success.
 * @param {*} errorFunction Function to call in case of ajax failure.
 * @param {*} data Base64 attachment to upload.
 * @param {*} name Attachment file name.
 * @param {*} hitId Hit id.
 */
function ajaxUploadAttachment(successFunction, errorFunction, data, name, hitId) {
    $.ajax({
        url: "/api/attachments/",
        data: '{"attachment": ' + JSON.stringify(data) + ', "attachment_name": ' + JSON.stringify(name) + ', "hit": ' + JSON.stringify(hitId) + ' }',
        type: 'POST',
        success: successFunction,
        error: errorFunction
    });
}

/**
 * Delete an attachment.
 * 
 * @param {*} successFunction Function to call in case of ajax success.
 * @param {*} errorFunction Function to call in case of ajax failure.
 * @param {*} id Attachment id.
 */
function ajaxDeleteAttachment(successFunction, errorFunction, id) {
    $.ajax({
        url: "/api/attachment/" + id + "/",
        type: 'DELETE',
        success: successFunction,
        error: errorFunction
    });
}

/**
 * Compute the cvss v3 value a screenshot for a hit.
 * 
 * @param {*} successFunction Function to call in case of ajax success.
 * @param {*} errorFunction Function to call in case of ajax failure.
 * @param {*} attackVector Attack vector.
 * @param {*} attackComplexity Attack complexity.
 * @param {*} privilegeRequired Privilege required for the attack.
 * @param {*} userInteraction Attack need user interaction.
 * @param {*} scope Scope is changed or not.
 * @param {*} confidentiality Confidentiality.
 * @param {*} integrity Integrity.
 * @param {*} availability Availability.
 */
function ajaxComputeCVSSv31(successFunction, errorFunction, attackVector, attackComplexity, privilegeRequired, userInteraction, scope, confidentiality, integrity, availability) {
    $.ajax({
        url: "/api/cvss3/",
        data: '{"attack_vector": ' + JSON.stringify(attackVector) + ', "attack_complexity": ' + JSON.stringify(attackComplexity) + ', "privilege_required": ' + JSON.stringify(privilegeRequired) + ', "user_interaction": ' + JSON.stringify(userInteraction) + ', "scope": ' + JSON.stringify(scope) + ', "confidentiality": ' + JSON.stringify(confidentiality) + ', "integrity": ' + JSON.stringify(integrity) + ', "availability": ' + JSON.stringify(availability) + ' }',
        type: 'POST',
        success: successFunction,
        error: errorFunction
    });
}

/**
 * Compute the cvss v3 and add it to the hit.
 * 
 * @param {*} successFunction Function to call in case of ajax success.
 * @param {*} errorFunction Function to call in case of ajax failure.
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
function ajaxAddCVSSv31(successFunction, errorFunction, hitId, attackVector, attackComplexity, privilegeRequired, userInteraction, scope, confidentiality, integrity, availability) {
    $.ajax({
        url: "/api/hit/" + hitId + "/cvss3/",
        data: '{"attack_vector": ' + JSON.stringify(attackVector) + ', "attack_complexity": ' + JSON.stringify(attackComplexity) + ', "privilege_required": ' + JSON.stringify(privilegeRequired) + ', "user_interaction": ' + JSON.stringify(userInteraction) + ', "scope": ' + JSON.stringify(scope) + ', "confidentiality": ' + JSON.stringify(confidentiality) + ', "integrity": ' + JSON.stringify(integrity) + ', "availability": ' + JSON.stringify(availability) + ' }',
        type: 'POST',
        success: successFunction,
        error: errorFunction
    });
}

/**
 * Remove the CVSS v3 value from the hit.
 * 
 * @param {*} successFunction Function to call in case of ajax success.
 * @param {*} errorFunction Function to call in case of ajax failure.
 * @param {*} hitId Hit ID.
 */
function ajaxRemoveCVSSv31(successFunction, errorFunction, hitId) {
    $.ajax({
        url: "/api/hit/" + hitId + "/cvss3/",
        type: 'DELETE',
        success: successFunction,
        error: errorFunction
    });
}

/**
 * Compute the cvss v4 value a screenshot for a hit.
 * 
 * @param {*} successFunction Function to call in case of ajax success.
 * @param {*} errorFunction Function to call in case of ajax failure.
 * @param {*} attackVector Attack vector.
 * @param {*} attackComplexity Attack complexity.
 * @param {*} attackRequirements Attack requirements.
 * @param {*} privilegeRequired Privilege required for the attack.
 * @param {*} userInteraction Attack need user interaction.
 * @param {*} confidentiality Confidentiality.
 * @param {*} integrity Integrity.
 * @param {*} availability Availability.
 * @param {*} subsequentConfidentiality Subsequent Confidentiality.
 * @param {*} subsequentIntegrity Subsequent Integrity.
 * @param {*} subsequentAvailability Subsequent Availability.
 */
function ajaxComputeCVSSv4(successFunction, errorFunction, attackVector, attackComplexity, attackRequirements, privilegeRequired, userInteraction, confidentiality, integrity, availability, subsequentConfidentiality, subsequentIntegrity, subsequentAvailability) {
    $.ajax({
        url: "/api/cvss4/",
        data: '{"attack_vector": ' + JSON.stringify(attackVector) + ', "attack_complexity": ' + JSON.stringify(attackComplexity) + ', "attack_requirements": ' + JSON.stringify(attackRequirements) + ', "privilege_required": ' + JSON.stringify(privilegeRequired) + ', "user_interaction": ' + JSON.stringify(userInteraction) + ', "confidentiality": ' + JSON.stringify(confidentiality) + ', "integrity": ' + JSON.stringify(integrity) + ', "availability": ' + JSON.stringify(availability) + ', "subsequent_confidentiality": ' + JSON.stringify(subsequentConfidentiality) + ', "subsequent_integrity": ' + JSON.stringify(subsequentIntegrity) + ', "subsequent_availability": ' + JSON.stringify(subsequentAvailability) + ' }',
        type: 'POST',
        success: successFunction,
        error: errorFunction
    });
}

/**
 * Compute the cvss v4 and add it to the hit.
 * 
 * @param {*} successFunction Function to call in case of ajax success.
 * @param {*} errorFunction Function to call in case of ajax failure.
 * @param {*} hitId Hit ID.
 * @param {*} attackVector Attack vector.
 * @param {*} attackComplexity Attack complexity.
 * @param {*} attackRequirements Attack requirements.
 * @param {*} privilegeRequired Privilege required for the attack.
 * @param {*} userInteraction Attack need user interaction.
 * @param {*} confidentiality Confidentiality.
 * @param {*} integrity Integrity.
 * @param {*} availability Availability.
 * @param {*} subsequentConfidentiality Subsequent Confidentiality.
 * @param {*} subsequentIntegrity Subsequent Integrity.
 * @param {*} subsequentAvailability Subsequent Availability.
 */
function ajaxAddCVSSv4(successFunction, errorFunction, hitId, attackVector, attackComplexity, attackRequirements, privilegeRequired, userInteraction, confidentiality, integrity, availability, subsequentConfidentiality, subsequentIntegrity, subsequentAvailability) {
    $.ajax({
        url: "/api/hit/" + hitId + "/cvss4/",
        data: '{"attack_vector": ' + JSON.stringify(attackVector) + ', "attack_complexity": ' + JSON.stringify(attackComplexity) + ', "attack_requirements": ' + JSON.stringify(attackRequirements) + ', "privilege_required": ' + JSON.stringify(privilegeRequired) + ', "user_interaction": ' + JSON.stringify(userInteraction) + ', "confidentiality": ' + JSON.stringify(confidentiality) + ', "integrity": ' + JSON.stringify(integrity) + ', "availability": ' + JSON.stringify(availability) + ', "subsequent_confidentiality": ' + JSON.stringify(subsequentConfidentiality) + ', "subsequent_integrity": ' + JSON.stringify(subsequentIntegrity) + ', "subsequent_availability": ' + JSON.stringify(subsequentAvailability) + ' }',
        type: 'POST',
        success: successFunction,
        error: errorFunction
    });
}

/**
 * Remove the CVSS v4 value from the hit.
 * 
 * @param {*} successFunction Function to call in case of ajax success.
 * @param {*} errorFunction Function to call in case of ajax failure.
 * @param {*} hitId Hit ID.
 */
function ajaxRemoveCVSSv4(successFunction, errorFunction, hitId) {
    $.ajax({
        url: "/api/hit/" + hitId + "/cvss4/",
        type: 'DELETE',
        success: successFunction,
        error: errorFunction
    });
}

/**
 * Create a flag.
 * 
 * @param {*} successFunction Function to call in case of ajax success.
 * @param {*} errorFunction Function to call in case of ajax failure.
 * @param {*} name Flag name.
 * @param {*} name Flag asset.
 * @param {*} note Flag note.
 * @param {*} assessmentId Assessment ID.
 * @param {*} assigneeId Assignee ID.
 */
function ajaxCreateFlag(successFunction, errorFunction, title, asset, note, assessmentId, assigneeId) {
    $.ajax({
        url: "/api/flags/",
        data: '{"title":' + JSON.stringify(title) + ',"asset":' + JSON.stringify(asset) + ',"note":' + JSON.stringify(note) + ',"done": "False", "assessment":' + JSON.stringify(assessmentId) + ',"assignee":' + JSON.stringify(assigneeId) + '}',
        type: 'POST',
        success: successFunction,
        error: errorFunction
    });
}

/**
 * Update a flag.
 * 
 * @param {*} successFunction Function to call in case of ajax success.
 * @param {*} errorFunction Function to call in case of ajax failure.
 * @param {*} name Flag id.
 * @param {*} name Flag name.
 * @param {*} name Flag asset.
 * @param {*} note Flag note.
 * @param {*} done Flag status.
 * @param {*} assessmentId Assessment ID.
 * @param {*} assigneeId Assignee ID.
 */
function ajaxUpdateFlag(successFunction, errorFunction, id, title, asset, note, done, assessmentId, assigneeId) {
    $.ajax({
        url: "/api/flag/" + id + "/",
        data: '{"title":' + JSON.stringify(title) + ',"asset":' + JSON.stringify(asset) + ',"note":' + JSON.stringify(note) + ',"done":' + JSON.stringify(done) + ',"assessment":' + JSON.stringify(assessmentId) + ',"assignee":' + JSON.stringify(assigneeId) + '}',
        type: 'PUT',
        success: successFunction,
        error: errorFunction
    });
}

/**
 * Delete a flag.
 * 
 * @param {*} successFunction Function to call in case of ajax success.
 * @param {*} errorFunction Function to call in case of ajax failure.
 * @param {*} id Flag id.
 */
function ajaxDeleteFlag(successFunction, errorFunction, id) {
    $.ajax({
        url: "/api/flag/" + id + "/",
        type: 'DELETE',
        success: successFunction,
        error: errorFunction
    });
}

/**
 * Mark flag as done.
 * 
 * @param {*} successFunction Function to call in case of ajax success.
 * @param {*} errorFunction Function to call in case of ajax failure.
 * @param {*} id Flag id.
 */
function ajaxMarkFlagAsDone(successFunction, errorFunction, id) {
    $.ajax({
        url: "/api/flag/" + id + "/complete/",
        type: 'POST',
        success: successFunction,
        error: errorFunction
    });
}

/**
 * Get a template
 * 
 * @param {*} successFunction Function to call in case of ajax success.
 * @param {*} errorFunction Function to call in case of ajax failure.
 * @param {*} id Template id.
 */
function ajaxGetTemplate(successFunction, errorFunction, id) {
    $.ajax({
        url: "/api/template/" + id + "/",
        type: 'GET',
        success: successFunction,
        error: errorFunction
    })
}

/**
 * Create a template.
 * 
 * @param {*} successFunction Function to call in case of ajax success.
 * @param {*} errorFunction Function to call in case of ajax failure.
 * @param {*} severity Template severity.
 * @param {*} asset Template asset.
 * @param {*} body Template body.
 * @param {*} remediation Template remediation.
 * @param {*} owner Template owner : If null, the template is common.
 */
function ajaxCreateTemplate(successFunction, errorFunction, severity, name, asset, body, remediation, owner) {
    $.ajax({
        url: "/api/templates/",
        data: '{"severity":' + JSON.stringify(severity) + ',"name":' + JSON.stringify(name) + ',"asset":' + JSON.stringify(asset) + ',"body":' + JSON.stringify(body) + ',"remediation":' + JSON.stringify(remediation) + ',"owner":' + JSON.stringify(owner) + '}',
        type: 'POST',
        success: successFunction,
        error: errorFunction
    });
}

/**
 * Update a template.
 * 
 * @param {*} successFunction Function to call in case of ajax success.
 * @param {*} errorFunction Function to call in case of ajax failure.
 * @param {*} id Template id.
 * @param {*} severity Template severity.
 * @param {*} name Template name.
 * @param {*} name Template asset.
 * @param {*} body Template body.
 * @param {*} remediation Template remediation.
 * @param {*} owner Template owner : If null, the template is common.
 */
function ajaxUpdateTemplate(successFunction, errorFunction, id, severity, name, asset, body, remediation, owner) {
    $.ajax({
        url: "/api/template/" + id + "/",
        data: '{"severity":' + JSON.stringify(severity) + ',"name":' + JSON.stringify(name) + ',"asset":' + JSON.stringify(asset) + ',"body":' + JSON.stringify(body) + ',"remediation":' + JSON.stringify(remediation) + ',"owner":' + JSON.stringify(owner) + '}',
        type: 'PUT',
        success: successFunction,
        error: errorFunction
    });
}

/**
 * Delete a template.
 * 
 * @param {*} successFunction Function to call in case of ajax success.
 * @param {*} errorFunction Function to call in case of ajax failure.
 * @param {*} id Template id.
 */
function ajaxDeleteTemplate(successFunction, errorFunction, id) {
    $.ajax({
        url: "/api/template/" + id + "/",
        type: 'DELETE',
        success: successFunction,
        error: errorFunction
    });
}

/**
 * Create a methodology.
 * 
 * @param {*} successFunction Function to call in case of ajax success.
 * @param {*} errorFunction Function to call in case of ajax failure.
 * @param {*} name Methodology name.
 * @param {*} description Methodology description.
 */
function ajaxCreateMethodology(successFunction, errorFunction, name, description) {
    $.ajax({
        url: "/api/methodologies/",
        data: '{"name":' + JSON.stringify(name) + ',"description":' + JSON.stringify(description) + '}',
        type: 'POST',
        success: successFunction,
        error: errorFunction
    });
}

/**
 * Update a methodology.
 * 
 * @param {*} successFunction Function to call in case of ajax success.
 * @param {*} errorFunction Function to call in case of ajax failure.
 * @param {*} id Methodology id.
 * @param {*} name Methodology name.
 * @param {*} description Methodology description.
 * @param {*} deprecated True if methodology is deprecated.
 */
function ajaxUpdateMethodology(successFunction, errorFunction, id, name, description, deprecated) {
    $.ajax({
        url: "/api/methodology/" + id + "/",
        data: '{"name":' + JSON.stringify(name) + ',"description":' + JSON.stringify(description) + ',"deprecated":' + JSON.stringify(deprecated) + '}',
        type: 'PUT',
        success: successFunction,
        error: errorFunction
    });
}

/**
 * Delete a methodology.
 * 
 * @param {*} successFunction Function to call in case of ajax success.
 * @param {*} errorFunction Function to call in case of ajax failure.
 * @param {*} id Methodology id.
 */
function ajaxDeleteMethodology(successFunction, errorFunction, id) {
    $.ajax({
        url: "/api/methodology/" + id + "/",
        type: 'DELETE',
        success: successFunction,
        error: errorFunction
    });
}

/**
 * Create a module.
 * 
 * @param {*} successFunction Function to call in case of ajax success.
 * @param {*} errorFunction Function to call in case of ajax failure.
 * @param {*} name Module name.
 * @param {*} description Module description.
 * @param {*} methodology Module methodology.
 */
function ajaxCreateModule(successFunction, errorFunction, name, description, methodology) {
    $.ajax({
        url: "/api/modules/",
        data: '{"name":' + JSON.stringify(name) + ',"description":' + JSON.stringify(description) + ',"methodology":' + JSON.stringify(methodology) + '}',
        type: 'POST',
        success: successFunction,
        error: errorFunction
    });
}

/**
 * Update a module.
 * 
 * @param {*} successFunction Function to call in case of ajax success.
 * @param {*} errorFunction Function to call in case of ajax failure.
 * @param {*} id Module id.
 * @param {*} name Module name.
 * @param {*} description Module description.
 * @param {*} methodology Module methodology.
 */
function ajaxUpdateModule(successFunction, errorFunction, id, name, description, methodology) {
    $.ajax({
        url: "/api/module/" + id + "/",
        data: '{"name":' + JSON.stringify(name) + ',"description":' + JSON.stringify(description) + ',"methodology":' + JSON.stringify(methodology) + '}',
        type: 'PUT',
        success: successFunction,
        error: errorFunction
    });
}

/**
 * Delete a module.
 * 
 * @param {*} successFunction Function to call in case of ajax success.
 * @param {*} errorFunction Function to call in case of ajax failure.
 * @param {*} id Module id.
 */
function ajaxDeleteModule(successFunction, errorFunction, id) {
    $.ajax({
        url: "/api/module/" + id + "/",
        type: 'DELETE',
        success: successFunction,
        error: errorFunction
    });
}

/**
 * Create a case.
 * 
 * @param {*} successFunction Function to call in case of ajax success.
 * @param {*} errorFunction Function to call in case of ajax failure.
 * @param {*} name Case name.
 * @param {*} description Case description.
 * @param {*} reference Case reference.
 * @param {*} module Case module.
 */
function ajaxCreateCase(successFunction, errorFunction, name, description, reference, module) {
    $.ajax({
        url: "/api/cases/",
        data: '{"name":' + JSON.stringify(name) + ',"description":' + JSON.stringify(description) + ',"reference":' + JSON.stringify(reference) + ',"module":' + JSON.stringify(module) + '}',
        type: 'POST',
        success: successFunction,
        error: errorFunction
    });
}

/**
 * Update a case.
 * 
 * @param {*} successFunction Function to call in case of ajax success.
 * @param {*} errorFunction Function to call in case of ajax failure.
 * @param {*} id Case id.
 * @param {*} name Case name.
 * @param {*} description Case description.
 * @param {*} reference Case reference.
 * @param {*} module Case module.
 */
function ajaxUpdateCase(successFunction, errorFunction, id, name, description, reference, module) {
    $.ajax({
        url: "/api/case/" + id + "/",
        data: '{"name":' + JSON.stringify(name) + ',"description":' + JSON.stringify(description) + ',"reference":' + JSON.stringify(reference) + ',"module":' + JSON.stringify(module) + '}',
        type: 'PUT',
        success: successFunction,
        error: errorFunction
    });
}

/**
 * Delete a case.
 * 
 * @param {*} successFunction Function to call in case of ajax success.
 * @param {*} errorFunction Function to call in case of ajax failure.
 * @param {*} id Case id.
 */
function ajaxDeleteCase(successFunction, errorFunction, id) {
    $.ajax({
        url: "/api/case/" + id + "/",
        type: 'DELETE',
        success: successFunction,
        error: errorFunction
    });
}

/**
 * Load flags from module to an assessment.
 * 
 * @param {*} successFunction Function to call in case of ajax success.
 * @param {*} errorFunction Function to call in case of ajax failure.
 * @param {*} moduleId Module id.
 * @param {*} assessmentId Assessment id.
 */
function ajaxLoadFlagsFromModule(successFunction, errorfunction, moduleId, assessmentId) {
    $.ajax({
        url: "/api/module/" + moduleId + "/load/" + assessmentId + "/",
        type: 'POST',
        success: successFunction,
        error: errorfunction
    });
}

/**
 * Create a host.
 * 
 * @param {*} successFunction Function to call in case of ajax success.
 * @param {*} errorFunction Function to call in case of ajax failure.
 * @param {*} ip Host ip.
 * @param {*} hostname Host hostname.
 * @param {*} os Host os.
 * @param {*} notes Host notes.
 * @param {*} project Host project.
 */
function ajaxCreateHost(successFunction, errorfunction, ip, hostname, os, notes, project) {
    $.ajax({
        url: "/api/hosts/",
        data: '{"ip":' + JSON.stringify(ip) + ',"hostname":' + JSON.stringify(hostname) + ',"os":' + JSON.stringify(os) + ',"notes":' + JSON.stringify(notes) + ',"project":' + JSON.stringify(project) + '}',
        type: 'POST',
        success: successFunction,
        error: errorfunction
    });
}

/**
 * Update a host.
 * 
 * @param {*} successFunction Function to call in case of ajax success.
 * @param {*} errorFunction Function to call in case of ajax failure.
 * @param {*} id Host id.
 * @param {*} ip Host ip.
 * @param {*} hostname Host hostname.
 * @param {*} os Host os.
 * @param {*} notes Host notes.
 * @param {*} project Host project.
 */
function ajaxUpdateHost(successFunction, errorfunction, id, ip, hostname, os, notes, project) {
    $.ajax({
        url: "/api/host/" + id + "/",
        data: '{"ip":' + JSON.stringify(ip) + ',"hostname":' + JSON.stringify(hostname) + ',"os":' + JSON.stringify(os) + ',"notes":' + JSON.stringify(notes) + ',"project":' + JSON.stringify(project) + '}',
        type: 'PUT',
        success: successFunction,
        error: errorfunction
    });
}

/**
 * Delete a host.
 * 
 * @param {*} successFunction Function to call in case of ajax success.
 * @param {*} errorFunction Function to call in case of ajax failure.
 * @param {*} id Host id.
 */
function ajaxDeleteHost(successFunction, errorfunction, id) {
    $.ajax({
        url: "/api/host/" + id + "/",
        type: 'DELETE',
        success: successFunction,
        error: errorfunction
    });
}

/**
 * Create a service.
 * 
 * @param {*} successFunction Function to call in case of ajax success.
 * @param {*} errorFunction Function to call in case of ajax failure.
 * @param {*} port Service port.
 * @param {*} protocol Service protocol.
 * @param {*} name Service name.
 * @param {*} version Service version.
 * @param {*} banner Service banner.
 * @param {*} host Service host.
 */
function ajaxCreateService(successFunction, errorfunction, port, protocol, name, version, banner, host) {
    $.ajax({
        url: "/api/services/",
        data: '{"port":' + JSON.stringify(port) + ',"protocol":' + JSON.stringify(protocol) + ',"name":' + JSON.stringify(name) + ',"version":' + JSON.stringify(version) + ',"banner":' + JSON.stringify(banner) + ',"host":' + JSON.stringify(host) + '}',
        type: 'POST',
        success: successFunction,
        error: errorfunction
    });
}

/**
 * Update a service.
 * 
 * @param {*} successFunction Function to call in case of ajax success.
 * @param {*} errorFunction Function to call in case of ajax failure.
 * @param {*} id Service id.
 * @param {*} port Service port.
 * @param {*} protocol Service protocol.
 * @param {*} name Service name.
 * @param {*} version Service version.
 * @param {*} banner Service banner.
 * @param {*} host Service host.
 */
function ajaxUpdateService(successFunction, errorfunction, id, port, protocol, name, version, banner, host) {
    $.ajax({
        url: "/api/service/" + id + "/",
        data: '{"port":' + JSON.stringify(port) + ',"protocol":' + JSON.stringify(protocol) + ',"name":' + JSON.stringify(name) + ',"version":' + JSON.stringify(version) + ',"banner":' + JSON.stringify(banner) + ',"host":' + JSON.stringify(host) + '}',
        type: 'PUT',
        success: successFunction,
        error: errorfunction
    });
}

/**
 * Delete a service.
 * 
 * @param {*} successFunction Function to call in case of ajax success.
 * @param {*} errorFunction Function to call in case of ajax failure.
 * @param {*} id Service id.
 */
function ajaxDeleteService(successFunction, errorfunction, id) {
    $.ajax({
        url: "/api/service/" + id + "/",
        type: 'DELETE',
        success: successFunction,
        error: errorfunction
    });
}

/**
 * Create an attack scenario.
 * 
 * @param {*} successFunction Function to call in case of ajax success.
 * @param {*} errorFunction Function to call in case of ajax failure.
 * @param {*} name Attack scenario name.
 * @param {*} scenario Attack scenario yaml content.
 * @param {*} svg Attack scenario svg content.
 * @param {*} body Attack scenario body.
 * @param {*} project Project attached to the attack scenario.
 */
 function ajaxCreateAttackScenario(successFunction, errorFunction, name, scenario, svg, body, project) {
    $.ajax({
        url: "/api/attackscenarios/",
        data: '{"name":' + JSON.stringify(name) + ',"scenario":' + JSON.stringify(scenario) + ',"svg":' + JSON.stringify(svg)+ ',"body":' + JSON.stringify(body) + ',"project":' + JSON.stringify(project) + '}',
        type: 'POST',
        success: successFunction,
        error: errorFunction
    });
}

/**
 * Update an attack scenario.
 * 
 * @param {*} successFunction Function to call in case of ajax success.
 * @param {*} errorFunction Function to call in case of ajax failure.
 * @param {*} id Attack scenario id.
 * @param {*} name Attack scenario name.
 * @param {*} scenario Attack scenario yaml content.
 * @param {*} svg Attack scenario svg content.
 * @param {*} body Attack scenario body.
 * @param {*} project Project attached to the attack scenario.
 */
function ajaxUpdateAttackScenario(successFunction, errorFunction, id, name, scenario, svg, body, project) {
    $.ajax({
        url: "/api/attackscenario/" + id + "/",
        data: '{"name":' + JSON.stringify(name) + ',"scenario":' + JSON.stringify(scenario) + ',"svg":' + JSON.stringify(svg)+ ',"body":' + JSON.stringify(body) + ',"project":' + JSON.stringify(project) + '}',
        type: 'PUT',
        success: successFunction,
        error: errorFunction
    });
}

/**
 * Delete an attack scenario.
 * 
 * @param {*} successFunction Function to call in case of ajax success.
 * @param {*} errorFunction Function to call in case of ajax failure.
 * @param {*} id Attack scenario id.
 */
function ajaxDeleteAttackScenario(successFunction, errorFunction, id) {
    $.ajax({
        url: "/api/attackscenario/" + id + "/",
        type: 'DELETE',
        success: successFunction,
        error: errorFunction
    });
}

/**
 * Create a recommendation.
 * 
 * @param {*} successFunction Function to call in case of ajax success.
 * @param {*} errorFunction Function to call in case of ajax failure.
 * @param {*} name Recommendation name.
 * @param {*} body Recommendation body.
 * @param {*} project Project attached to the recommendation.
 */
function ajaxCreateRecommendation(successFunction, errorFunction, name, body, project) {
    $.ajax({
        url: "/api/recommendations/",
        data: '{"name":' + JSON.stringify(name) + ',"body":' + JSON.stringify(body) + ',"project":' + JSON.stringify(project) + '}',
        type: 'POST',
        success: successFunction,
        error: errorFunction
    });
}

/**
 * Update a recommendation.
 * 
 * @param {*} successFunction Function to call in case of ajax success.
 * @param {*} errorFunction Function to call in case of ajax failure.
 * @param {*} name Recommendation name.
 * @param {*} body Recommendation body.
 * @param {*} project Project attached to the recommendation.
 */
function ajaxUpdateRecommendation(successFunction, errorFunction, id, name, body, project) {
    $.ajax({
        url: "/api/recommendation/" + id + "/",
        data: '{"name":' + JSON.stringify(name) + ',"body":' + JSON.stringify(body) + ',"project":' + JSON.stringify(project) + '}',
        type: 'PUT',
        success: successFunction,
        error: errorFunction
    });
}

/**
 * Delete a recommendation.
 * 
 * @param {*} successFunction Function to call in case of ajax success.
 * @param {*} errorFunction Function to call in case of ajax failure.
 * @param {*} id Recommendation id.
 */
function ajaxDeleteRecommendation(successFunction, errorFunction, id) {
    $.ajax({
        url: "/api/recommendation/" + id + "/",
        type: 'DELETE',
        success: successFunction,
        error: errorFunction
    });
}

/**
 * Create a retest campaign.
 * 
 * @param {*} successFunction Function to call in case of ajax success.
 * @param {*} errorFunction Function to call in case of ajax failure.
 * @param {*} name Retest campaign name.
 * @param {*} introduction Retest campaign introduction.
 * @param {*} conclusion Retest campaign conclusion.
 * @param {*} start_date Retest campaign start date.
 * @param {*} end_date Retest campaign end date.
 * @param {*} project Retest campaign project.
 */
function ajaxCreateRetestCampaign(successFunction, errorFunction, name, introduction, conclusion, start_date, end_date, project) {
    $.ajax({
        url: "/api/retestcampaigns/",
        data: '{"name":' + JSON.stringify(name) + ',"introduction":' + JSON.stringify(introduction) + ',"conclusion":' + JSON.stringify(conclusion) + ',"start_date":' + JSON.stringify(start_date) + ',"end_date":' + JSON.stringify(end_date) + ',"project":' + JSON.stringify(project) + '}',
        type: 'POST',
        success: successFunction,
        error: errorFunction
    });
}

/**
 * Update a retest campaign.
 * 
 * @param {*} successFunction Function to call in case of ajax success.
 * @param {*} errorFunction Function to call in case of ajax failure.
 * @param {*} id Retest campaign id. 
 * @param {*} name Retest campaign name.
 * @param {*} introduction Retest campaign introduction.
 * @param {*} conclusion Retest campaign conclusion.
 * @param {*} start_date Retest campaign start date.
 * @param {*} end_date Retest campaign end date.
 * @param {*} project Retest campaign project.
 */
function ajaxUpdateRetestCampaign(successFunction, errorFunction, id, name, introduction, conclusion, start_date, end_date, project) {
    $.ajax({
        url: "/api/retestcampaign/" + id + "/",
        data: '{"name":' + JSON.stringify(name) + ',"introduction":' + JSON.stringify(introduction) + ',"conclusion":' + JSON.stringify(conclusion)+ ',"start_date":' + JSON.stringify(start_date)+ ',"end_date":' + JSON.stringify(end_date) + ',"project":' + JSON.stringify(project) + '}',
        type: 'PUT',
        success: successFunction,
        error: errorFunction
    });
}

/**
 * Delete a retest campaign.
 * 
 * @param {*} successFunction Function to call in case of ajax success.
 * @param {*} errorFunction Function to call in case of ajax failure.
 * @param {*} id Retest campaign id.
 */
function ajaxDeleteRetestCampaign(successFunction, errorFunction, id) {
    $.ajax({
        url: "/api/retestcampaign/" + id + "/",
        type: 'DELETE',
        success: successFunction,
        error: errorFunction
    });
}

/**
 * Create a retest hit.
 * 
 * @param {*} successFunction Function to call in case of ajax success.
 * @param {*} errorFunction Function to call in case of ajax failure.
 * @param {*} body Retest hit body.
 * @param {*} status Retest hit status.
 * @param {*} hit Retest hit hit.
 * @param {*} retestcampaign Retest hit campaign.
 */
function ajaxCreateRetestHit(successFunction, errorFunction, body, status, hit, retestcampaign) {
    $.ajax({
        url: "/api/retesthits/",
        data: '{"body":' + JSON.stringify(body) + ',"status":' + JSON.stringify(status) + ',"hit":' + JSON.stringify(hit) + ',"retest_campaign":' + JSON.stringify(retestcampaign) + '}',
        type: 'POST',
        success: successFunction,
        error: errorFunction
    });
}

/**
 * Update a retest hit.
 * 
 * @param {*} successFunction Function to call in case of ajax success.
 * @param {*} errorFunction Function to call in case of ajax failure.
 * @param {*} id Retest hit id. 
 * @param {*} body Retest hit body.
 * @param {*} status Retest hit status.
 * @param {*} hit Retest hit hit.
 * @param {*} retestcampaign Retest hit campaign.
 */
function ajaxUpdateRetestHit(successFunction, errorFunction, id, body, status, hit, retestcampaign) {
    $.ajax({
        url: "/api/retesthit/" + id + "/",
        data: '{"body":' + JSON.stringify(body) + ',"status":' + JSON.stringify(status) + ',"hit":' + JSON.stringify(hit) + ',"retest_campaign":' + JSON.stringify(retestcampaign) + '}',
        type: 'PUT',
        success: successFunction,
        error: errorFunction
    });
}

/**
 * Delete a retest hit.
 * 
 * @param {*} successFunction Function to call in case of ajax success.
 * @param {*} errorFunction Function to call in case of ajax failure.
 * @param {*} id Retest hit id.
 */
function ajaxDeleteRetestHit(successFunction, errorFunction, id) {
    $.ajax({
        url: "/api/retesthit/" + id + "/",
        type: 'DELETE',
        success: successFunction,
        error: errorFunction
    });
}

/**
 * Grant authentication token.
 * 
 * @param {*} successFunction Function to call in case of ajax success.
 * @param {*} errorFunction Function to call in case of ajax failure.
 */
 function ajaxGrantToken(successFunction, errorFunction) {
    $.ajax({
        url: "/api/token/",
        type: 'POST',
        data: {},
        success: successFunction,
        error: errorFunction
    });
}

/**
 * Revoke authentication token.
 * 
 * @param {*} successFunction Function to call in case of ajax success.
 * @param {*} errorFunction Function to call in case of ajax failure.
 */
 function ajaxRevokeToken(successFunction, errorFunction) {
    $.ajax({
        url: "/api/token/",
        type: 'DELETE',
        success: successFunction,
        error: errorFunction
    });
}

/**
 * Change current user password.
 * 
 * @param {*} successFunction Function to call in case of ajax success.
 * @param {*} errorFunction Function to call in case of ajax failure.
 * @param {*} oldPassword Old password.
 * @param {*} newPassword1 New password1.
 * @param {*} newPassword2 New password2.
 */
 function ajaxChangePassword(successFunction, errorFunction, oldPassword, newPassword1, newPassword2) {
    $.ajax({
        url: "/api/account/change_password/",
        type: 'POST',
        data: '{"oldPassword":' + JSON.stringify(oldPassword) + ',"newPassword1":' + JSON.stringify(newPassword1) + ',"newPassword2":' + JSON.stringify(newPassword2) + '}',
        success: successFunction,
        error: errorFunction
    });
}

/**
 * Request ChatGPT.
 * 
 * @param {*} successFunction Function to call in case of ajax success.
 * @param {*} errorFunction Function to call in case of ajax failure.
 * @param {*} question Request to ChatGPT.
 */
function ajaxChatGpt(successFunction, errorFunction, question) {
    $.ajax({
        url: "/api/chatgpt/",
        type: 'POST',
        data: '{"question":' + JSON.stringify(question) + '}',
        success: successFunction,
        error: errorFunction
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
