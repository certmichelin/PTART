var attackVectorValue = null;
var attackComplexityValue = null;
var privilegeRequiredValue = null;
var userInteractionValue = null;
var scopeValue = null;
var confidentialityValue = null;
var integrityValue = null;
var availabilityValue = null;

function clearCVSS() {

    attackVectorValue = null;
    attackComplexityValue = null;
    privilegeRequiredValue = null;
    userInteractionValue = null;
    scopeValue = null;
    confidentialityValue = null;
    integrityValue = null;
    availabilityValue = null;

    $("#cvssValue").attr("class", "cvss-badge cvss-badge-secondary")
    $("#cvssValue").text("No Rating (---)");
    $("#cvss").val("---"); 

    $('#vectorNetwork').removeClass("active");
    $('#vectorAdjacent').removeClass("active");
    $('#vectorLocal').removeClass("active");
    $('#vectorPhysical').removeClass("active");
    $('#complexityLow').removeClass("active");
    $('#complexityHigh').removeClass("active");
    $('#privilegesNone').removeClass("active");
    $('#privilegesLow').removeClass("active");
    $('#privilegesHigh').removeClass("active");
    $('#userInteractionNone').removeClass("active");
    $('#userInteractionRequired').removeClass("active");
    $('#scopeUnchanged').removeClass("active");
    $('#scopeChanged').removeClass("active");
    $('#confidentialityNone').removeClass("active");
    $('#confidentialityLow').removeClass("active");
    $('#confidentialityHigh').removeClass("active");
    $('#integrityNone').removeClass("active");
    $('#integrityLow').removeClass("active");
    $('#integrityHigh').removeClass("active");
    $('#availabilityNone').removeClass("active");
    $('#availabilityLow').removeClass("active");
    $('#availabilityHigh').removeClass("active");
}

$('.cvss').each(function () {
    cvss = parseFloat($(this).text());
    if (!isNaN(cvss) && $(this).text().trim() != "0.0") {
        if (cvss > 0 && cvss < 4.0) {
            $(this).attr("class", "cvss cvss-badge cvss-badge-success")
        } else if (cvss < 7.0) {
            $(this).attr("class", "cvss cvss-badge cvss-badge-warning")
        } else if (cvss < 9.0) {
            $(this).attr("class", "cvss cvss-badge cvss-badge-danger")
        } else {
            $(this).attr("class", "cvss cvss-badge cvss-badge-dark")
        }
    }
});

function displayCVSS(cvss) {
    text = "";
    if (!isNaN(parseFloat(cvss))) {
        if (cvss <= 0) {
            $("#cvssValue").attr("class", "cvss-badge cvss-badge-secondary")
            cvss = "0.0";
            text = cvss + " - None";
        } else if (cvss < 4.0) {
            $("#cvssValue").attr("class", "cvss-badge cvss-badge-success")
            text = cvss + " - Low"
        } else if (cvss < 7.0) {
            $("#cvssValue").attr("class", "cvss-badge cvss-badge-warning")
            text = cvss + " - Medium"
        } else if (cvss < 9.0) {
            $("#cvssValue").attr("class", "cvss-badge cvss-badge-danger")
            text = cvss + " - High"
        } else {
            $("#cvssValue").attr("class", "cvss-badge cvss-badge-dark")
            text = cvss + " - Critical"
        }
        $("#cvssValue").text(text);
        $("#cvss").val(cvss);
    } else {
        $("#cvssValue").attr("class", "cvss-badge cvss-badge-secondary")
        $("#cvssValue").text("No Rating (---)");
        $("#cvss").val("---");
    }
}

function loadCVSSButtonsState(attackVector, attackComplexity, privilegeRequired, userInteraction, scope, confidentiality, integrity, availability) {

    if (attackVector !== "") {
        switch (attackVector) {
            case "N":
                $('#vectorNetwork').addClass("active");
                break;
            case "A":
                $('#vectorAdjacent').addClass("active");
                break;
            case "L":
                $('#vectorLocal').addClass("active");
                break;
            case "P":
                $('#vectorPhysical').addClass("active");
                break;
        }
        attackVectorValue = attackVector;
    }

    if (attackComplexity !== "") {
        switch (attackComplexity) {
            case "L":
                $('#complexityLow').addClass("active");
                break;
            case "H":
                $('#complexityHigh').addClass("active");
                break;
        }
        attackComplexityValue = attackComplexity;
    }
    if (privilegeRequired !== "") {
        switch (privilegeRequired) {
            case "N":
                $('#privilegesNone').addClass("active");
                break;
            case "L":
                $('#privilegesLow').addClass("active");
                break;
            case "H":
                $('#privilegesHigh').addClass("active");
                break;
        }
        privilegeRequiredValue = privilegeRequired;
    }

    if (userInteraction !== "") {
        switch (userInteraction) {
            case "N":
                $('#userInteractionNone').addClass("active");
                break;
            case "R":
                $('#userInteractionRequired').addClass("active");
                break;
        }
        userInteractionValue = userInteraction;
    }

    if (scope !== "") {
        switch (scope) {
            case "U":
                $('#scopeUnchanged').addClass("active");
                break;
            case "C":
                $('#scopeChanged').addClass("active");
                break;
        }
        scopeValue = scope;
    }

    if (confidentiality !== "") {
        switch (confidentiality) {
            case "N":
                $('#confidentialityNone').addClass("active");
                break;
            case "L":
                $('#confidentialityLow').addClass("active");
                break;
            case "H":
                $('#confidentialityHigh').addClass("active");
                break;
        }
        confidentialityValue = confidentiality;
    }

    if (integrity !== "") {
        switch (integrity) {
            case "N":
                $('#integrityNone').addClass("active");
                break;
            case "L":
                $('#integrityLow').addClass("active");
                break;
            case "H":
                $('#integrityHigh').addClass("active");
                break;
        }
        integrityValue = integrity;
    }

    if (availability !== "") {
        switch (availability) {
            case "N":
                $('#availabilityNone').addClass("active");
                break;
            case "L":
                $('#availabilityLow').addClass("active");
                break;
            case "H":
                $('#availabilityHigh').addClass("active");
                break;
        }
        availabilityValue = availability;
    }
}

function catchSuccessMethod(data) {
}

function catchErrorMethod(data) {
}

function cvssComputationCallback(data) {
    displayCVSS(data.decimal_value);
}

function computeCVSSv31() {
    if (isCVSSComputable()) {
        ajaxComputeCVSSv31(cvssComputationCallback, catchErrorMethod, attackVectorValue, attackComplexityValue, privilegeRequiredValue, userInteractionValue, scopeValue, confidentialityValue, integrityValue, availabilityValue);
    } else {
        displayCVSS(null);
    }
}

function addCVSSv31ToHit(hitId) {
    if (isCVSSComputable()) {
        ajaxAddCVSSv31(catchSuccessMethod, catchErrorMethod, hitId, attackVectorValue, attackComplexityValue, privilegeRequiredValue, userInteractionValue, scopeValue, confidentialityValue, integrityValue, availabilityValue);
    }
}

function isCVSSComputable() {
    return attackVectorValue !== null && attackComplexityValue !== null && privilegeRequiredValue !== null && userInteractionValue !== null && scopeValue !== null && confidentialityValue !== null && integrityValue !== null && availabilityValue != null;
}

$('#vectorPhysical').click(function (e) {
    if(attackVectorValue == "P"){
        attackVectorValue = null;
    } else {
        $('#vectorNetwork').removeClass("active");
        $('#vectorAdjacent').removeClass("active");
        $('#vectorLocal').removeClass("active");
        attackVectorValue = "P";
    }
    computeCVSSv31();
});

$('#vectorLocal').click(function (e) {
    if(attackVectorValue == "L"){
        attackVectorValue = null;
    } else {
        $('#vectorNetwork').removeClass("active");
        $('#vectorAdjacent').removeClass("active");
        $('#vectorPhysical').removeClass("active");
        attackVectorValue = "L";
    }
    computeCVSSv31();
});

$('#vectorAdjacent').click(function (e) {
    if(attackVectorValue == "A"){
        attackVectorValue = null;
    } else {
        $('#vectorNetwork').removeClass("active");
        $('#vectorLocal').removeClass("active");
        $('#vectorPhysical').removeClass("active");
        attackVectorValue = "A";
    }
    computeCVSSv31();
});

$('#vectorNetwork').click(function (e) {
    if(attackVectorValue == "N"){
        attackVectorValue = null;
    } else {
        $('#vectorAdjacent').removeClass("active");
        $('#vectorLocal').removeClass("active");
        $('#vectorPhysical').removeClass("active");
        attackVectorValue = "N";
    }
    computeCVSSv31();
});

$('#complexityLow').click(function (e) {
    if(attackComplexityValue == "L"){
        attackComplexityValue = null;
    } else {
        $('#complexityHigh').removeClass("active");
        attackComplexityValue = "L";
    }
    computeCVSSv31();
});

$('#complexityHigh').click(function (e) {
    if(attackComplexityValue == "H"){
        attackComplexityValue = null;
    } else {
        $('#complexityLow').removeClass("active");
        attackComplexityValue = "H";
    }
    computeCVSSv31();
});

$('#privilegesNone').click(function (e) {
    if(privilegeRequiredValue == "N"){
        privilegeRequiredValue = null;
    } else {
        $('#privilegesLow').removeClass("active");
        $('#privilegesHigh').removeClass("active");
        privilegeRequiredValue = "N";
    }
    computeCVSSv31();
});

$('#privilegesLow').click(function (e) {
    if(privilegeRequiredValue == "L"){
        privilegeRequiredValue = null;
    } else {
        $('#privilegesNone').removeClass("active");
        $('#privilegesHigh').removeClass("active");
        privilegeRequiredValue = "L";
    }
    computeCVSSv31();
});

$('#privilegesHigh').click(function (e) {
    if(privilegeRequiredValue == "H"){
        privilegeRequiredValue = null;
    } else {
        $('#privilegesNone').removeClass("active");
        $('#privilegesLow').removeClass("active");
        privilegeRequiredValue = "H";
    }
    computeCVSSv31();
});

$('#userInteractionNone').click(function (e) {
    if(userInteractionValue == "N"){
        userInteractionValue = null;
    } else {
        $('#userInteractionRequired').removeClass("active");
        userInteractionValue = "N";
    }
    computeCVSSv31();
});

$('#userInteractionRequired').click(function (e) {
    if(userInteractionValue == "R"){
        userInteractionValue = null;
    } else {
        $('#userInteractionNone').removeClass("active");
        userInteractionValue = "R";
    }
    computeCVSSv31();
});

$('#scopeUnchanged').click(function (e) {
    if(scopeValue == "U"){
        scopeValue = null;
    } else {
        $('#scopeChanged').removeClass("active");
        scopeValue = "U";
    }
    computeCVSSv31();
});

$('#scopeChanged').click(function (e) {
    if(scopeValue == "C"){
        scopeValue = null;
    } else {
        $('#scopeUnchanged').removeClass("active");
        scopeValue = "C";
    }
    computeCVSSv31();
});

$('#confidentialityNone').click(function (e) {
    if(confidentialityValue == "N"){
        confidentialityValue = null;
    } else {
        $('#confidentialityLow').removeClass("active");
        $('#confidentialityHigh').removeClass("active");
        confidentialityValue = "N";
    }
    computeCVSSv31();
});

$('#confidentialityLow').click(function (e) {
    if(confidentialityValue == "L"){
        confidentialityValue = null;
    } else {
        $('#confidentialityNone').removeClass("active");
        $('#confidentialityHigh').removeClass("active");
        confidentialityValue = "L";
    }
    computeCVSSv31();
});

$('#confidentialityHigh').click(function (e) {
    if(confidentialityValue == "H"){
        confidentialityValue = null;
    } else {
        $('#confidentialityNone').removeClass("active");
        $('#confidentialityLow').removeClass("active");
        confidentialityValue = "H";
    }
    computeCVSSv31();
});

$('#integrityNone').click(function (e) {
    if(integrityValue == "N"){
        integrityValue = null;
    } else {
        $('#integrityLow').removeClass("active");
        $('#integrityHigh').removeClass("active");
        integrityValue = "N";
    }
    computeCVSSv31();
});

$('#integrityLow').click(function (e) {
    if(integrityValue == "L"){
        integrityValue = null;
    } else {
        $('#integrityNone').removeClass("active");
        $('#integrityHigh').removeClass("active");
        integrityValue = "L";
    }
    computeCVSSv31();
});

$('#integrityHigh').click(function (e) {
    if(integrityValue == "H"){
        integrityValue = null;
    } else {
        $('#integrityNone').removeClass("active");
        $('#integrityLow').removeClass("active");
        integrityValue = "H";
    }
    computeCVSSv31();
});

$('#availabilityNone').click(function (e) {
    if(availabilityValue == "N"){
        availabilityValue = null;
    } else {
        $('#availabilityLow').removeClass("active");
        $('#availabilityHigh').removeClass("active");
        availabilityValue = "N";
    }
    computeCVSSv31();
});

$('#availabilityLow').click(function (e) {
    if(availabilityValue == "L"){
        availabilityValue = null;
    } else {
        $('#availabilityNone').removeClass("active");
        $('#availabilityHigh').removeClass("active");
        availabilityValue = "L";
    }
    computeCVSSv31();
});

$('#availabilityHigh').click(function (e) {
    if(availabilityValue == "H"){
        availabilityValue = null;
    } else {
        $('#availabilityNone').removeClass("active");
        $('#availabilityLow').removeClass("active");
        availabilityValue = "H";
    }
    computeCVSSv31();
});