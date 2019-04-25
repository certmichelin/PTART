var attackVectorValue = null;
var attackComplexityValue = null;
var privilegeRequiredValue = null;
var userInteractionValue = null;
var scopeValue = null;
var confidentialityValue = null;
var integrityValue = null;
var availabilityValue = null;


$('.cvss').each(function () {
    cvss = parseFloat($(this).text());
    if (!isNaN(cvss) && $(this).text().trim() != "0.0") {
        if (cvss > 0 && cvss < 4.0) {
            $(this).attr("class", "cvss label label-success")
        } else if (cvss < 7.0) {
            $(this).attr("class", "cvss label label-warning")
        } else if (cvss < 9.0) {
            $(this).attr("class", "cvss label label-danger")
        } else {
            $(this).attr("class", "cvss label label-critical")
        }
    }
});

function displayCVSS(cvss) {
    text = "";
    if (!isNaN(parseFloat(cvss))) {
        if (cvss <= 0) {
            $("#cvssValue").attr("class", "label label-default")
            cvss = "0.0";
            text = cvss + " - None";
        } else if (cvss < 4.0) {
            $("#cvssValue").attr("class", "label label-success")
            text = cvss + " - Low"
        } else if (cvss < 7.0) {
            $("#cvssValue").attr("class", "label label-warning")
            text = cvss + " - Medium"
        } else if (cvss < 9.0) {
            $("#cvssValue").attr("class", "label label-danger")
            text = cvss + " - High"
        } else {
            $("#cvssValue").attr("class", "label label-critical")
            text = cvss + " - Critical"
        }
        $("#cvssValue").text(text);
        $("#cvss").val(cvss);
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

function computeCVSSv3() {
    if (isCVSSComputable()) {
        ajaxComputeCVSSv3(cvssComputationCallback, catchErrorMethod, attackVectorValue, attackComplexityValue, privilegeRequiredValue, userInteractionValue, scopeValue, confidentialityValue, integrityValue, availabilityValue);
    }
}

function addCVSSv3ToSh0t(shotId) {
    if (isCVSSComputable()) {
        ajaxAddCVSSv3(catchSuccessMethod, catchErrorMethod, shotId, attackVectorValue, attackComplexityValue, privilegeRequiredValue, userInteractionValue, scopeValue, confidentialityValue, integrityValue, availabilityValue);
    }
}

function isCVSSComputable() {
    return attackVectorValue !== null && attackComplexityValue !== null && privilegeRequiredValue !== null && userInteractionValue !== null && scopeValue !== null && confidentialityValue !== null && integrityValue !== null && availabilityValue != null;
}

$('#vectorPhysical').click(function (e) {
    attackVectorValue = "P";
    computeCVSSv3();
});

$('#vectorLocal').click(function (e) {
    attackVectorValue = "L";
    computeCVSSv3();
});

$('#vectorAdjacent').click(function (e) {
    attackVectorValue = "A";
    computeCVSSv3();
});

$('#vectorNetwork').click(function (e) {
    attackVectorValue = "N";
    computeCVSSv3();
});

$('#complexityLow').click(function (e) {
    attackComplexityValue = "L";
    computeCVSSv3();
});

$('#complexityHigh').click(function (e) {
    attackComplexityValue = "H";
    computeCVSSv3();
});

$('#privilegesNone').click(function (e) {
    privilegeRequiredValue = "N";
    computeCVSSv3();
});

$('#privilegesLow').click(function (e) {
    privilegeRequiredValue = "L";
    computeCVSSv3();
});

$('#privilegesHigh').click(function (e) {
    privilegeRequiredValue = "H";
    computeCVSSv3();
});

$('#userInteractionNone').click(function (e) {
    userInteractionValue = "N";
    computeCVSSv3();
});

$('#userInteractionRequired').click(function (e) {
    userInteractionValue = "R";
    computeCVSSv3();
});

$('#scopeUnchanged').click(function (e) {
    scopeValue = "U";
    computeCVSSv3();
});

$('#scopeChanged').click(function (e) {
    scopeValue = "C";
    computeCVSSv3();
});

$('#confidentialityNone').click(function (e) {
    confidentialityValue = "N";
    computeCVSSv3();
});

$('#confidentialityLow').click(function (e) {
    confidentialityValue = "L";
    computeCVSSv3();
});

$('#confidentialityHigh').click(function (e) {
    confidentialityValue = "H";
    computeCVSSv3();
});

$('#integrityNone').click(function (e) {
    integrityValue = "N";
    computeCVSSv3();
});

$('#integrityLow').click(function (e) {
    integrityValue = "L";
    computeCVSSv3();
});

$('#integrityHigh').click(function (e) {
    integrityValue = "H";
    computeCVSSv3();
});

$('#availabilityNone').click(function (e) {
    availabilityValue = "N";
    computeCVSSv3();
});

$('#availabilityLow').click(function (e) {
    availabilityValue = "L";
    computeCVSSv3();
});

$('#availabilityHigh').click(function (e) {
    availabilityValue = "H";
    computeCVSSv3();
});