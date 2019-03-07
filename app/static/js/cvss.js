var attackVectorValue = null;
var attackComplexityValue = null;
var privilegeRequiredValue = null;
var userInteractionValue = null;
var scopeValue = null;
var confidentialityValue = null;
var integrityValue = null;
var availabilityValue = null;

/**
 * Compute CVSS score.
 */
function computeCVSS() {
    // console.log("-----------------------------------------");
    // console.log("-----------------------------------------");
    // console.log("-----------------------------------------");
    // console.log("attackVectorValue : " + attackVectorValue);
    // console.log("attackComplexityValue : " + attackComplexityValue);
    // console.log("privilegeRequiredValue : " + privilegeRequiredValue);
    // console.log("userInteractionValue : " + userInteractionValue);
    // console.log("scopeValue : " + scopeValue);
    // console.log("confidentialityValue : " + confidentialityValue);
    // console.log("integrityValue : " + integrityValue);
    // console.log("availabilityValue : " + availabilityValue);

    if (attackVectorValue != null && attackComplexityValue != null && privilegeRequiredValue != null && userInteractionValue != null && scopeValue != null && confidentialityValue != null && integrityValue != null && availabilityValue != null) {
        iscBase = getISCBase();
        isc = getISC(iscBase);
        exploitability = getExploitability();
        var cvss = -1.0;

        if (isc > 0.0) {
            if (scopeValue == "U") {
                cvss = roundup(Math.min(isc + exploitability), 10.0);
            } else {
                cvss = roundup(Math.min(1.08 * (isc + exploitability), 10.0));
            }
        }

        displayCVSS(cvss);

        // console.log("ISC base : " + iscBase);
        // console.log("ISC : " + isc);
        // console.log("Exploitability : " + exploitability);
        // console.log("CVSS : " + cvss);


    }
}

function displayCVSS(cvss){
    text = "";
    if (cvss < 0) {
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

function roundup(value) {
    return (Math.ceil(value * 10.0) / 10.0).toFixed(1);
}

function getExploitability() {
    return 8.22 * getAttackVectorValue() * getAttackComplexityValue() * getPrivilegeRequiredValue() * getUserInteractionValue();
}

function getISCBase() {
    return (1.0 - ((1.0 - getCIAValue(confidentialityValue)) * (1.0 - getCIAValue(integrityValue)) * (1.0 - getCIAValue(availabilityValue))));
}

function getISC(iscBase) {
    var value = null;
    if (scopeValue == "U") {
        value = 6.42 * iscBase;
    } else {
        value = 7.52 * (iscBase - 0.029) - 3.25 * Math.pow((iscBase - 0.02), 15);
    }
    return value;
}

function getCIAValue(valueStr) {
    value = 0.0;
    switch (valueStr) {
        case "H":
            value = 0.56;
            break;
        case "L":
            value = 0.22;
            break;
        case "N":
            value = 0.0;
            break;
    }
    return value;
}

function getAttackVectorValue() {
    value = 0.0;
    switch (attackVectorValue) {
        case "N":
            value = 0.85;
            break;
        case "A":
            value = 0.62;
            break;
        case "L":
            value = 0.55;
            break;
        case "P":
            value = 0.2;
            break;
    }
    return value;
}

function getAttackComplexityValue() {
    value = 0.0;
    switch (attackComplexityValue) {
        case "L":
            value = 0.77;
            break;
        case "H":
            value = 0.44;
            break;
    }
    return value;
}

function getPrivilegeRequiredValue() {
    value = 0.0;
    switch (privilegeRequiredValue) {
        case "N":
            value = 0.85;
            break;
        case "L":
            value = (scopeValue == "U") ? 0.62 : 0.68;
            break;
        case "H":
            value = (scopeValue == "U") ? 0.27 : 0.50;
            break;
    }
    return value;
}

function getUserInteractionValue() {
    value = 0.0;
    switch (userInteractionValue) {
        case "N":
            value = 0.85;
            break;
        case "R":
            value = 0.62;
            break;
    }
    return value;
}

$('#vectorPhysical').click(function (e) {
    attackVectorValue = "P";
    computeCVSS();
});

$('#vectorLocal').click(function (e) {
    attackVectorValue = "L";
    computeCVSS();
});

$('#vectorAdjacent').click(function (e) {
    attackVectorValue = "A";
    computeCVSS();
});

$('#vectorNetwork').click(function (e) {
    attackVectorValue = "N";
    computeCVSS();
});

$('#complexityLow').click(function (e) {
    attackComplexityValue = "L";
    computeCVSS();
});

$('#complexityHigh').click(function (e) {
    attackComplexityValue = "H";
    computeCVSS();
});

$('#privilegesNone').click(function (e) {
    privilegeRequiredValue = "N";
    computeCVSS();
});

$('#privilegesLow').click(function (e) {
    privilegeRequiredValue = "L";
    computeCVSS();
});

$('#privilegesHigh').click(function (e) {
    privilegeRequiredValue = "H";
    computeCVSS();
});

$('#userInteractionNone').click(function (e) {
    userInteractionValue = "N";
    computeCVSS();
});

$('#userInteractionRequired').click(function (e) {
    userInteractionValue = "R";
    computeCVSS();
});

$('#scopeUnchanged').click(function (e) {
    scopeValue = "U";
    computeCVSS();
});

$('#scopeChanged').click(function (e) {
    scopeValue = "C";
    computeCVSS();
});

$('#confidentialityNone').click(function (e) {
    confidentialityValue = "N";
    computeCVSS();
});

$('#confidentialityLow').click(function (e) {
    confidentialityValue = "L";
    computeCVSS();
});

$('#confidentialityHigh').click(function (e) {
    confidentialityValue = "H";
    computeCVSS();
});

$('#integrityNone').click(function (e) {
    integrityValue = "N";
    computeCVSS();
});

$('#integrityLow').click(function (e) {
    integrityValue = "L";
    computeCVSS();
});

$('#integrityHigh').click(function (e) {
    integrityValue = "H";
    computeCVSS();
});

$('#availabilityNone').click(function (e) {
    availabilityValue = "N";
    computeCVSS();
});

$('#availabilityLow').click(function (e) {
    availabilityValue = "L";
    computeCVSS();
});

$('#availabilityHigh').click(function (e) {
    availabilityValue = "H";
    computeCVSS();
});