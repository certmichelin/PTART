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

    switch (attackComplexity) {
        case "L":
            $('#complexityLow').addClass("active");
            break;
        case "H":
            $('#complexityHigh').addClass("active");
            break;
    }
    attackComplexityValue = attackComplexity;
    
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

    switch (userInteraction) {
        case "N":
            $('#userInteractionNone').addClass("active");
            break;
        case "R":
            $('#userInteractionRequired').addClass("active");
            break;
    }
    userInteractionValue = userInteraction;

    switch (scope) {
        case "U":
            $('#scopeUnchanged').addClass("active");
            break;
        case "C":
            $('#scopeChanged').addClass("active");
            break;
    }
    scopeValue = scope;

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

$('#vectorPhysical').click(function (e) {
    attackVectorValue = "P";
});

$('#vectorLocal').click(function (e) {
    attackVectorValue = "L";
});

$('#vectorAdjacent').click(function (e) {
    attackVectorValue = "A";
});

$('#vectorNetwork').click(function (e) {
    attackVectorValue = "N";
});

$('#complexityLow').click(function (e) {
    attackComplexityValue = "L";
});

$('#complexityHigh').click(function (e) {
    attackComplexityValue = "H";
});

$('#privilegesNone').click(function (e) {
    privilegeRequiredValue = "N";
});

$('#privilegesLow').click(function (e) {
    privilegeRequiredValue = "L";
});

$('#privilegesHigh').click(function (e) {
    privilegeRequiredValue = "H";
});

$('#userInteractionNone').click(function (e) {
    userInteractionValue = "N";
});

$('#userInteractionRequired').click(function (e) {
    userInteractionValue = "R";
});

$('#scopeUnchanged').click(function (e) {
    scopeValue = "U";
});

$('#scopeChanged').click(function (e) {
    scopeValue = "C";
});

$('#confidentialityNone').click(function (e) {
    confidentialityValue = "N";
});

$('#confidentialityLow').click(function (e) {
    confidentialityValue = "L";
});

$('#confidentialityHigh').click(function (e) {
    confidentialityValue = "H";
});

$('#integrityNone').click(function (e) {
    integrityValue = "N";
});

$('#integrityLow').click(function (e) {
    integrityValue = "L";
});

$('#integrityHigh').click(function (e) {
    integrityValue = "H";
});

$('#availabilityNone').click(function (e) {
    availabilityValue = "N";
});

$('#availabilityLow').click(function (e) {
    availabilityValue = "L";
});

$('#availabilityHigh').click(function (e) {
    availabilityValue = "H";
});