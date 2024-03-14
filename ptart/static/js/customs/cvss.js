var cvss3AttackVectorValue = null;
var cvss3AttackComplexityValue = null;
var cvss3PrivilegeRequiredValue = null;
var cvss3UserInteractionValue = null;
var cvss3ScopeValue = null;
var cvss3ConfidentialityValue = null;
var cvss3IntegrityValue = null;
var cvss3AvailabilityValue = null;

function clearCVSS3() {

    cvss3AttackVectorValue = null;
    cvss3AttackComplexityValue = null;
    cvss3PrivilegeRequiredValue = null;
    cvss3UserInteractionValue = null;
    cvss3ScopeValue = null;
    cvss3ConfidentialityValue = null;
    cvss3IntegrityValue = null;
    cvss3AvailabilityValue = null;

    $("#cvss3Value").attr("class", "cvss3-badge cvss3-badge-secondary")
    $("#cvss3Value").text("No Rating (---)");
    $("#cvss3").val("---"); 

    $('#cvss3VectorNetwork').removeClass("active");
    $('#cvss3VectorAdjacent').removeClass("active");
    $('#cvss3VectorLocal').removeClass("active");
    $('#cvss3VectorPhysical').removeClass("active");
    $('#cvss3ComplexityLow').removeClass("active");
    $('#cvss3ComplexityHigh').removeClass("active");
    $('#cvss3PrivilegesNone').removeClass("active");
    $('#cvss3PrivilegesLow').removeClass("active");
    $('#cvss3PrivilegesHigh').removeClass("active");
    $('#cvss3UserInteractionNone').removeClass("active");
    $('#cvss3UserInteractionRequired').removeClass("active");
    $('#cvss3ScopeUnchanged').removeClass("active");
    $('#cvss3ScopeChanged').removeClass("active");
    $('#cvss3ConfidentialityNone').removeClass("active");
    $('#cvss3ConfidentialityLow').removeClass("active");
    $('#cvss3ConfidentialityHigh').removeClass("active");
    $('#cvss3IntegrityNone').removeClass("active");
    $('#cvss3IntegrityLow').removeClass("active");
    $('#cvss3IntegrityHigh').removeClass("active");
    $('#cvss3AvailabilityNone').removeClass("active");
    $('#cvss3AvailabilityLow').removeClass("active");
    $('#cvss3AvailabilityHigh').removeClass("active");
}

$('.cvss3').each(function () {
    cvss3 = parseFloat($(this).text());
    if (!isNaN(cvss3) && $(this).text().trim() != "0.0") {
        if (cvss3 > 0 && cvss3 < 4.0) {
            $(this).attr("class", "cvss3 cvss3-badge cvss3-badge-success")
        } else if (cvss3 < 7.0) {
            $(this).attr("class", "cvss3 cvss3-badge cvss3-badge-warning")
        } else if (cvss3 < 9.0) {
            $(this).attr("class", "cvss3 cvss3-badge cvss3-badge-danger")
        } else {
            $(this).attr("class", "cvss3 cvss3-badge cvss3-badge-dark")
        }
    }
});

function displayCVSS3(cvss3) {
    text = "";
    if (!isNaN(parseFloat(cvss3))) {
        if (cvss3 <= 0) {
            $("#cvss3Value").attr("class", "cvss3-badge cvss3-badge-secondary")
            cvss3 = "0.0";
            text = cvss3 + " - None";
        } else if (cvss3 < 4.0) {
            $("#cvss3Value").attr("class", "cvss3-badge cvss3-badge-success")
            text = cvss3 + " - Low"
        } else if (cvss3 < 7.0) {
            $("#cvss3Value").attr("class", "cvss3-badge cvss3-badge-warning")
            text = cvss3 + " - Medium"
        } else if (cvss3 < 9.0) {
            $("#cvss3Value").attr("class", "cvss3-badge cvss3-badge-danger")
            text = cvss3 + " - High"
        } else {
            $("#cvss3Value").attr("class", "cvss3-badge cvss3-badge-dark")
            text = cvss3 + " - Critical"
        }
        $("#cvss3Value").text(text);
        $("#cvss3").val(cvss3);
    } else {
        $("#cvss3Value").attr("class", "cvss3-badge cvss3-badge-secondary")
        $("#cvss3Value").text("No Rating (---)");
        $("#cvss3").val("---");
    }
}

function loadCVSS3ButtonsState(attackVector, attackComplexity, privilegeRequired, userInteraction, scope, confidentiality, integrity, availability) {

    if (attackVector !== "") {
        switch (attackVector) {
            case "N":
                $('#cvss3VectorNetwork').addClass("active");
                break;
            case "A":
                $('#cvss3VectorAdjacent').addClass("active");
                break;
            case "L":
                $('#cvss3VectorLocal').addClass("active");
                break;
            case "P":
                $('#cvss3VectorPhysical').addClass("active");
                break;
        }
        cvss3AttackVectorValue = attackVector;
    }

    if (attackComplexity !== "") {
        switch (attackComplexity) {
            case "L":
                $('#cvss3ComplexityLow').addClass("active");
                break;
            case "H":
                $('#cvss3ComplexityHigh').addClass("active");
                break;
        }
        cvss3AttackComplexityValue = attackComplexity;
    }
    if (privilegeRequired !== "") {
        switch (privilegeRequired) {
            case "N":
                $('#cvss3PrivilegesNone').addClass("active");
                break;
            case "L":
                $('#cvss3PrivilegesLow').addClass("active");
                break;
            case "H":
                $('#cvss3PrivilegesHigh').addClass("active");
                break;
        }
        cvss3PrivilegeRequiredValue = privilegeRequired;
    }

    if (userInteraction !== "") {
        switch (userInteraction) {
            case "N":
                $('#cvss3UserInteractionNone').addClass("active");
                break;
            case "R":
                $('#cvss3UserInteractionRequired').addClass("active");
                break;
        }
        cvss3UserInteractionValue = userInteraction;
    }

    if (scope !== "") {
        switch (scope) {
            case "U":
                $('#cvss3ScopeUnchanged').addClass("active");
                break;
            case "C":
                $('#cvss3ScopeChanged').addClass("active");
                break;
        }
        cvss3ScopeValue = scope;
    }

    if (confidentiality !== "") {
        switch (confidentiality) {
            case "N":
                $('#cvss3ConfidentialityNone').addClass("active");
                break;
            case "L":
                $('#cvss3ConfidentialityLow').addClass("active");
                break;
            case "H":
                $('#cvss3ConfidentialityHigh').addClass("active");
                break;
        }
        cvss3ConfidentialityValue = confidentiality;
    }

    if (integrity !== "") {
        switch (integrity) {
            case "N":
                $('#cvss3IntegrityNone').addClass("active");
                break;
            case "L":
                $('#cvss3IntegrityLow').addClass("active");
                break;
            case "H":
                $('#cvss3IntegrityHigh').addClass("active");
                break;
        }
        cvss3IntegrityValue = integrity;
    }

    if (availability !== "") {
        switch (availability) {
            case "N":
                $('#cvss3AvailabilityNone').addClass("active");
                break;
            case "L":
                $('#cvss3AvailabilityLow').addClass("active");
                break;
            case "H":
                $('#cvss3AvailabilityHigh').addClass("active");
                break;
        }
        cvss3AvailabilityValue = availability;
    }
}

function catchCvss3SuccessMethod(data) {
}

function catchCvss3ErrorMethod(data) {
}

function cvss3ComputationCallback(data) {
    displayCVSS3(data.decimal_value);
}

function computeCVSSv31() {
    if (isCVSS3Computable()) {
        ajaxComputeCVSSv31(cvss3ComputationCallback, catchCvss3ErrorMethod, cvss3AttackVectorValue, cvss3AttackComplexityValue, cvss3PrivilegeRequiredValue, cvss3UserInteractionValue, cvss3ScopeValue, cvss3ConfidentialityValue, cvss3IntegrityValue, cvss3AvailabilityValue);
    } else {
        displayCVSS3(null);
    }
}

function addCVSSv31ToHit(hitId) {
    if (isCVSS3Computable()) {
        ajaxAddCVSSv31(catchCvss3SuccessMethod, catchCvss3ErrorMethod, hitId, cvss3AttackVectorValue, cvss3AttackComplexityValue, cvss3PrivilegeRequiredValue, cvss3UserInteractionValue, cvss3ScopeValue, cvss3ConfidentialityValue, cvss3IntegrityValue, cvss3AvailabilityValue);
    }
}

function isCVSS3Computable() {
    return cvss3AttackVectorValue !== null && cvss3AttackComplexityValue !== null && cvss3PrivilegeRequiredValue !== null && cvss3UserInteractionValue !== null && cvss3ScopeValue !== null && cvss3ConfidentialityValue !== null && cvss3IntegrityValue !== null && cvss3AvailabilityValue != null;
}

$('#cvss3VectorPhysical').click(function (e) {
    if(cvss3AttackVectorValue == "P"){
        cvss3AttackVectorValue = null;
    } else {
        $('#cvss3VectorNetwork').removeClass("active");
        $('#cvss3VectorAdjacent').removeClass("active");
        $('#cvss3VectorLocal').removeClass("active");
        cvss3AttackVectorValue = "P";
    }
    computeCVSSv31();
});

$('#cvss3VectorLocal').click(function (e) {
    if(cvss3AttackVectorValue == "L"){
        cvss3AttackVectorValue = null;
    } else {
        $('#cvss3VectorNetwork').removeClass("active");
        $('#cvss3VectorAdjacent').removeClass("active");
        $('#cvss3VectorPhysical').removeClass("active");
        cvss3AttackVectorValue = "L";
    }
    computeCVSSv31();
});

$('#cvss3VectorAdjacent').click(function (e) {
    if(cvss3AttackVectorValue == "A"){
        cvss3AttackVectorValue = null;
    } else {
        $('#cvss3VectorNetwork').removeClass("active");
        $('#cvss3VectorLocal').removeClass("active");
        $('#cvss3VectorPhysical').removeClass("active");
        cvss3AttackVectorValue = "A";
    }
    computeCVSSv31();
});

$('#cvss3VectorNetwork').click(function (e) {
    if(cvss3AttackVectorValue == "N"){
        cvss3AttackVectorValue = null;
    } else {
        $('#cvss3VectorAdjacent').removeClass("active");
        $('#cvss3VectorLocal').removeClass("active");
        $('#cvss3VectorPhysical').removeClass("active");
        cvss3AttackVectorValue = "N";
    }
    computeCVSSv31();
});

$('#cvss3ComplexityLow').click(function (e) {
    if(cvss3AttackComplexityValue == "L"){
        cvss3AttackComplexityValue = null;
    } else {
        $('#cvss3ComplexityHigh').removeClass("active");
        cvss3AttackComplexityValue = "L";
    }
    computeCVSSv31();
});

$('#cvss3ComplexityHigh').click(function (e) {
    if(cvss3AttackComplexityValue == "H"){
        cvss3AttackComplexityValue = null;
    } else {
        $('#cvss3ComplexityLow').removeClass("active");
        cvss3AttackComplexityValue = "H";
    }
    computeCVSSv31();
});

$('#cvss3PrivilegesNone').click(function (e) {
    if(cvss3PrivilegeRequiredValue == "N"){
        cvss3PrivilegeRequiredValue = null;
    } else {
        $('#cvss3PrivilegesLow').removeClass("active");
        $('#cvss3PrivilegesHigh').removeClass("active");
        cvss3PrivilegeRequiredValue = "N";
    }
    computeCVSSv31();
});

$('#cvss3PrivilegesLow').click(function (e) {
    if(cvss3PrivilegeRequiredValue == "L"){
        cvss3PrivilegeRequiredValue = null;
    } else {
        $('#cvss3PrivilegesNone').removeClass("active");
        $('#cvss3PrivilegesHigh').removeClass("active");
        cvss3PrivilegeRequiredValue = "L";
    }
    computeCVSSv31();
});

$('#cvss3PrivilegesHigh').click(function (e) {
    if(cvss3PrivilegeRequiredValue == "H"){
        cvss3PrivilegeRequiredValue = null;
    } else {
        $('#cvss3PrivilegesNone').removeClass("active");
        $('#cvss3PrivilegesLow').removeClass("active");
        cvss3PrivilegeRequiredValue = "H";
    }
    computeCVSSv31();
});

$('#cvss3UserInteractionNone').click(function (e) {
    if(cvss3UserInteractionValue == "N"){
        cvss3UserInteractionValue = null;
    } else {
        $('#cvss3UserInteractionRequired').removeClass("active");
        cvss3UserInteractionValue = "N";
    }
    computeCVSSv31();
});

$('#cvss3UserInteractionRequired').click(function (e) {
    if(cvss3UserInteractionValue == "R"){
        cvss3UserInteractionValue = null;
    } else {
        $('#cvss3UserInteractionNone').removeClass("active");
        cvss3UserInteractionValue = "R";
    }
    computeCVSSv31();
});

$('#cvss3ScopeUnchanged').click(function (e) {
    if(cvss3ScopeValue == "U"){
        cvss3ScopeValue = null;
    } else {
        $('#cvss3ScopeChanged').removeClass("active");
        cvss3ScopeValue = "U";
    }
    computeCVSSv31();
});

$('#cvss3ScopeChanged').click(function (e) {
    if(cvss3ScopeValue == "C"){
        cvss3ScopeValue = null;
    } else {
        $('#cvss3ScopeUnchanged').removeClass("active");
        cvss3ScopeValue = "C";
    }
    computeCVSSv31();
});

$('#cvss3ConfidentialityNone').click(function (e) {
    if(cvss3ConfidentialityValue == "N"){
        cvss3ConfidentialityValue = null;
    } else {
        $('#cvss3ConfidentialityLow').removeClass("active");
        $('#cvss3ConfidentialityHigh').removeClass("active");
        cvss3ConfidentialityValue = "N";
    }
    computeCVSSv31();
});

$('#cvss3ConfidentialityLow').click(function (e) {
    if(cvss3ConfidentialityValue == "L"){
        cvss3ConfidentialityValue = null;
    } else {
        $('#cvss3ConfidentialityNone').removeClass("active");
        $('#cvss3ConfidentialityHigh').removeClass("active");
        cvss3ConfidentialityValue = "L";
    }
    computeCVSSv31();
});

$('#cvss3ConfidentialityHigh').click(function (e) {
    if(cvss3ConfidentialityValue == "H"){
        cvss3ConfidentialityValue = null;
    } else {
        $('#cvss3ConfidentialityNone').removeClass("active");
        $('#cvss3ConfidentialityLow').removeClass("active");
        cvss3ConfidentialityValue = "H";
    }
    computeCVSSv31();
});

$('#cvss3IntegrityNone').click(function (e) {
    if(cvss3IntegrityValue == "N"){
        cvss3IntegrityValue = null;
    } else {
        $('#cvss3IntegrityLow').removeClass("active");
        $('#cvss3IntegrityHigh').removeClass("active");
        cvss3IntegrityValue = "N";
    }
    computeCVSSv31();
});

$('#cvss3IntegrityLow').click(function (e) {
    if(cvss3IntegrityValue == "L"){
        cvss3IntegrityValue = null;
    } else {
        $('#cvss3IntegrityNone').removeClass("active");
        $('#cvss3IntegrityHigh').removeClass("active");
        cvss3IntegrityValue = "L";
    }
    computeCVSSv31();
});

$('#cvss3IntegrityHigh').click(function (e) {
    if(cvss3IntegrityValue == "H"){
        cvss3IntegrityValue = null;
    } else {
        $('#cvss3IntegrityNone').removeClass("active");
        $('#cvss3IntegrityLow').removeClass("active");
        cvss3IntegrityValue = "H";
    }
    computeCVSSv31();
});

$('#cvss3AvailabilityNone').click(function (e) {
    if(cvss3AvailabilityValue == "N"){
        cvss3AvailabilityValue = null;
    } else {
        $('#cvss3AvailabilityLow').removeClass("active");
        $('#cvss3AvailabilityHigh').removeClass("active");
        cvss3AvailabilityValue = "N";
    }
    computeCVSSv31();
});

$('#cvss3AvailabilityLow').click(function (e) {
    if(cvss3AvailabilityValue == "L"){
        cvss3AvailabilityValue = null;
    } else {
        $('#cvss3AvailabilityNone').removeClass("active");
        $('#cvss3AvailabilityHigh').removeClass("active");
        cvss3AvailabilityValue = "L";
    }
    computeCVSSv31();
});

$('#cvss3AvailabilityHigh').click(function (e) {
    if(cvss3AvailabilityValue == "H"){
        cvss3AvailabilityValue = null;
    } else {
        $('#cvss3AvailabilityNone').removeClass("active");
        $('#cvss3AvailabilityLow').removeClass("active");
        cvss3AvailabilityValue = "H";
    }
    computeCVSSv31();
});