var cvss3AttackVectorValue = null;
var cvss3AttackComplexityValue = null;
var cvss3PrivilegeRequiredValue = null;
var cvss3UserInteractionValue = null;
var cvss3ScopeValue = null;
var cvss3ConfidentialityValue = null;
var cvss3IntegrityValue = null;
var cvss3AvailabilityValue = null;

var cvss4AttackVectorValue = null;
var cvss4AttackComplexityValue = null;
var cvss4AttackRequirementsValue = null;
var cvss4PrivilegeRequiredValue = null;
var cvss4UserInteractionValue = null;
var cvss4ScopeValue = null;
var cvss4ConfidentialityValue = null;
var cvss4IntegrityValue = null;
var cvss4AvailabilityValue = null;
var cvss4SubsequentConfidentialityValue = null;
var cvss4SubsequentIntegrityValue = null;
var cvss4SubsequentAvailabilityValue = null;

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

function clearCVSS4() {

    cvss4AttackVectorValue = null;
    cvss4AttackComplexityValue = null;
    cvss4AttackRequirementsValue = null;
    cvss4UserInteractionValue = null;
    cvss4ConfidentialityValue = null;
    cvss4IntegrityValue = null;
    cvss4AvailabilityValue = null;
    cvss4SubsequentConfidentialityValue = null;
    cvss4SubsequentIntegrityValue = null;
    cvss4SubsequentAvailabilityValue = null;

    $("#cvss4Value").attr("class", "cvss4-badge cvss4-badge-secondary")
    $("#cvss4Value").text("No Rating (---)");
    $("#cvss4").val("---"); 

    $('#cvss4VectorNetwork').removeClass("active");
    $('#cvss4VectorAdjacent').removeClass("active");
    $('#cvss4VectorLocal').removeClass("active");
    $('#cvss4VectorPhysical').removeClass("active");
    $('#cvss4ComplexityLow').removeClass("active");
    $('#cvss4ComplexityHigh').removeClass("active");
    $('#cvss4RequirementsNone').removeClass("active");
    $('#cvss4RequirementsPresent').removeClass("active");
    $('#cvss4PrivilegesNone').removeClass("active");
    $('#cvss4PrivilegesLow').removeClass("active");
    $('#cvss4PrivilegesHigh').removeClass("active");
    $('#cvss4UserInteractionNone').removeClass("active");
    $('#cvss4UserInteractionPassive').removeClass("active");
    $('#cvss4UserInteractionActive').removeClass("active");
    $('#cvss4ScopeUnchanged').removeClass("active");
    $('#cvss4ScopeChanged').removeClass("active");
    $('#cvss4ConfidentialityNone').removeClass("active");
    $('#cvss4ConfidentialityLow').removeClass("active");
    $('#cvss4ConfidentialityHigh').removeClass("active");
    $('#cvss4IntegrityNone').removeClass("active");
    $('#cvss4IntegrityLow').removeClass("active");
    $('#cvss4IntegrityHigh').removeClass("active");
    $('#cvss4AvailabilityNone').removeClass("active");
    $('#cvss4AvailabilityLow').removeClass("active");
    $('#cvss4AvailabilityHigh').removeClass("active");
    $('#cvss4SubsequentConfidentialityNone').removeClass("active");
    $('#cvss4SubsequentConfidentialityLow').removeClass("active");
    $('#cvss4SubsequentConfidentialityHigh').removeClass("active");
    $('#cvss4SubsequentIntegrityNone').removeClass("active");
    $('#cvss4SubsequentIntegrityLow').removeClass("active");
    $('#cvss4SubsequentIntegrityHigh').removeClass("active");
    $('#cvss4SubsequentAvailabilityNone').removeClass("active");
    $('#cvss4SubsequentAvailabilityLow').removeClass("active");
    $('#cvss4SubsequentAvailabilityHigh').removeClass("active");
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

$('.cvss4').each(function () {
    cvss4 = parseFloat($(this).text());
    if (!isNaN(cvss4) && $(this).text().trim() != "0.0") {
        if (cvss4 > 0 && cvss4 < 4.0) {
            $(this).attr("class", "cvss4 cvss4-badge cvss4-badge-success")
        } else if (cvss4 < 7.0) {
            $(this).attr("class", "cvss4 cvss4-badge cvss4-badge-warning")
        } else if (cvss4 < 9.0) {
            $(this).attr("class", "cvss4 cvss4-badge cvss4-badge-danger")
        } else {
            $(this).attr("class", "cvss4 cvss4-badge cvss4-badge-dark")
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

function displayCVSS4(cvss4) {
    text = "";
    if (!isNaN(parseFloat(cvss4))) {
        if (cvss4 <= 0) {
            $("#cvss4Value").attr("class", "cvss4-badge cvss4-badge-secondary")
            cvss4 = "0.0";
            text = cvss4 + " - None";
        } else if (cvss4 < 4.0) {
            $("#cvss4Value").attr("class", "cvss4-badge cvss4-badge-success")
            text = cvss4 + " - Low"
        } else if (cvss4 < 7.0) {
            $("#cvss4Value").attr("class", "cvss4-badge cvss4-badge-warning")
            text = cvss4 + " - Medium"
        } else if (cvss4 < 9.0) {
            $("#cvss4Value").attr("class", "cvss4-badge cvss4-badge-danger")
            text = cvss4 + " - High"
        } else {
            $("#cvss4Value").attr("class", "cvss4-badge cvss4-badge-dark")
            text = cvss4 + " - Critical"
        }
        $("#cvss4Value").text(text);
        $("#cvss4").val(cvss4);
    } else {
        $("#cvss4Value").attr("class", "cvss4-badge cvss4-badge-secondary")
        $("#cvss4Value").text("No Rating (---)");
        $("#cvss4").val("---");
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

function loadCVSS4ButtonsState(attackVector, attackComplexity, attackRequirements, privilegeRequired, userInteraction, confidentiality, integrity, availability, subsequentConfidentiality, subsequentIntegrity, subsequentAvailability) {

    if (attackVector !== "") {
        switch (attackVector) {
            case "N":
                $('#cvss4VectorNetwork').addClass("active");
                break;
            case "A":
                $('#cvss4VectorAdjacent').addClass("active");
                break;
            case "L":
                $('#cvss4VectorLocal').addClass("active");
                break;
            case "P":
                $('#cvss4VectorPhysical').addClass("active");
                break;
        }
        cvss4AttackVectorValue = attackVector;
    }

    if (attackComplexity !== "") {
        switch (attackComplexity) {
            case "L":
                $('#cvss4ComplexityLow').addClass("active");
                break;
            case "H":
                $('#cvss4ComplexityHigh').addClass("active");
                break;
        }
        cvss4AttackComplexityValue = attackComplexity;
    }

    if (attackRequirements !== "") {
        switch (attackRequirements) {
            case "N":
                $('#cvss4ComplexityLow').addClass("active");
                break;
            case "P":
                $('#cvss4ComplexityHigh').addClass("active");
                break;
        }
        cvss4AttackRequirementsValue = attackRequirements;
    }

    if (privilegeRequired !== "") {
        switch (privilegeRequired) {
            case "N":
                $('#cvss4PrivilegesNone').addClass("active");
                break;
            case "L":
                $('#cvss4PrivilegesLow').addClass("active");
                break;
            case "H":
                $('#cvss4PrivilegesHigh').addClass("active");
                break;
        }
        cvss4PrivilegeRequiredValue = privilegeRequired;
    }

    if (userInteraction !== "") {
        switch (userInteraction) {
            case "N":
                $('#cvss4UserInteractionNone').addClass("active");
                break;
            case "P":
                $('#cvss4UserInteractionPassive').addClass("active");
                break;
            case "A":
                $('#cvss4UserInteractionActive').addClass("active");
                break;
        }
        cvss4UserInteractionValue = userInteraction;
    }

    if (confidentiality !== "") {
        switch (confidentiality) {
            case "N":
                $('#cvss4ConfidentialityNone').addClass("active");
                break;
            case "L":
                $('#cvss4ConfidentialityLow').addClass("active");
                break;
            case "H":
                $('#cvss4ConfidentialityHigh').addClass("active");
                break;
        }
        cvss4ConfidentialityValue = confidentiality;
    }

    if (integrity !== "") {
        switch (integrity) {
            case "N":
                $('#cvss4IntegrityNone').addClass("active");
                break;
            case "L":
                $('#cvss4IntegrityLow').addClass("active");
                break;
            case "H":
                $('#cvss4IntegrityHigh').addClass("active");
                break;
        }
        cvss4IntegrityValue = integrity;
    }

    if (availability !== "") {
        switch (availability) {
            case "N":
                $('#cvss4AvailabilityNone').addClass("active");
                break;
            case "L":
                $('#cvss4AvailabilityLow').addClass("active");
                break;
            case "H":
                $('#cvss4AvailabilityHigh').addClass("active");
                break;
        }
        cvss4AvailabilityValue = availability;
    }

    if (subsequentConfidentiality !== "") {
        switch (subsequentConfidentiality) {
            case "N":
                $('#cvss4SubsequentConfidentialityNone').addClass("active");
                break;
            case "L":
                $('#cvss4SubsequentConfidentialityLow').addClass("active");
                break;
            case "H":
                $('#cvss4SubsequentConfidentialityHigh').addClass("active");
                break;
        }
        cvss4SubsequentConfidentialityValue = subsequentConfidentiality;
    }

    if (subsequentIntegrity !== "") {
        switch (subsequentIntegrity) {
            case "N":
                $('#cvss4SubsequentIntegrityNone').addClass("active");
                break;
            case "L":
                $('#cvss4SubsequentIntegrityLow').addClass("active");
                break;
            case "H":
                $('#cvss4SubsequentIntegrityHigh').addClass("active");
                break;
        }
        cvss4SubsequentIntegrityValue = subsequentIntegrity;
    }

    if (subsequentavailability !== "") {
        switch (subsequentavailability) {
            case "N":
                $('#cvss4SubsequentAvailabilityNone').addClass("active");
                break;
            case "L":
                $('#cvss4SubsequentAvailabilityLow').addClass("active");
                break;
            case "H":
                $('#cvss4SubsequentAvailabilityHigh').addClass("active");
                break;
        }
        cvss4SubsequentAvailabilityValue = subsequentavailability;
    }
}

function catchCvss3SuccessMethod(data) {
}

function catchCvss3ErrorMethod(data) {
}

function cvss3ComputationCallback(data) {
    displayCVSS3(data.decimal_value);
}

function catchCvss4SuccessMethod(data) {
}

function catchCvss4ErrorMethod(data) {
}

function cvss4ComputationCallback(data) {
    displayCVSS4(data.decimal_value);
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

function computeCVSSv4() {
    if (isCVSS4Computable()) {
        ajaxComputeCVSSv4(cvss4ComputationCallback, catchCvss4ErrorMethod, cvss4AttackVectorValue, cvss4AttackComplexityValue, cvss4AttackRequirementsValue, cvss4PrivilegeRequiredValue, cvss4UserInteractionValue, cvss4ConfidentialityValue, cvss4IntegrityValue, cvss4AvailabilityValue, cvss4SubsequentConfidentialityValue, cvss4SubsequentIntegrityValue, cvss4SubsequentAvailabilityValue);
    } else {
        displayCVSS4(null);
    }
}

function addCVSSv4ToHit(hitId) {
    if (isCVSS4Computable()) {
        ajaxAddCVSSv4(catchCvss4SuccessMethod, catchCvss4ErrorMethod, hitId, cvss4AttackVectorValue, cvss4AttackComplexityValue, cvss4AttackRequirementsValue, cvss4PrivilegeRequiredValue, cvss4UserInteractionValue, cvss4ConfidentialityValue, cvss4IntegrityValue, cvss4AvailabilityValue, cvss4SubsequentConfidentialityValue, cvss4SubsequentIntegrityValue, cvss4SubsequentAvailabilityValue);
    }
}

function isCVSS4Computable() {
    return cvss4AttackVectorValue !== null && cvss4AttackComplexityValue !== null && cvss4PrivilegeRequiredValue !== null && cvss4UserInteractionValue !== null && cvss4ConfidentialityValue !== null && cvss4IntegrityValue !== null && cvss4AvailabilityValue != null && cvss4SubsequentConfidentialityValue !== null && cvss4SubsequentIntegrityValue !== null && cvss4SubsequentAvailabilityValue != null;
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

$('#cvss4VectorPhysical').click(function (e) {
    if(cvss4AttackVectorValue == "P"){
        cvss4AttackVectorValue = null;
    } else {
        $('#cvss4VectorNetwork').removeClass("active");
        $('#cvss4VectorAdjacent').removeClass("active");
        $('#cvss4VectorLocal').removeClass("active");
        cvss4AttackVectorValue = "P";
    }
    computeCVSSv4();
});

$('#cvss4VectorLocal').click(function (e) {
    if(cvss4AttackVectorValue == "L"){
        cvss4AttackVectorValue = null;
    } else {
        $('#cvss4VectorNetwork').removeClass("active");
        $('#cvss4VectorAdjacent').removeClass("active");
        $('#cvss4VectorPhysical').removeClass("active");
        cvss4AttackVectorValue = "L";
    }
    computeCVSSv4();
});

$('#cvss4VectorAdjacent').click(function (e) {
    if(cvss4AttackVectorValue == "A"){
        cvss4AttackVectorValue = null;
    } else {
        $('#cvss4VectorNetwork').removeClass("active");
        $('#cvss4VectorLocal').removeClass("active");
        $('#cvss4VectorPhysical').removeClass("active");
        cvss4AttackVectorValue = "A";
    }
    computeCVSSv4();
});

$('#cvss4VectorNetwork').click(function (e) {
    if(cvss4AttackVectorValue == "N"){
        cvss4AttackVectorValue = null;
    } else {
        $('#cvss4VectorAdjacent').removeClass("active");
        $('#cvss4VectorLocal').removeClass("active");
        $('#cvss4VectorPhysical').removeClass("active");
        cvss4AttackVectorValue = "N";
    }
    computeCVSSv4();
});

$('#cvss4ComplexityLow').click(function (e) {
    if(cvss4AttackComplexityValue == "L"){
        cvss4AttackComplexityValue = null;
    } else {
        $('#cvss4ComplexityHigh').removeClass("active");
        cvss4AttackComplexityValue = "L";
    }
    computeCVSSv4();
});

$('#cvss4ComplexityHigh').click(function (e) {
    if(cvss4AttackComplexityValue == "H"){
        cvss4AttackComplexityValue = null;
    } else {
        $('#cvss4ComplexityLow').removeClass("active");
        cvss4AttackComplexityValue = "H";
    }
    computeCVSSv4();
});

$('#cvss4RequirementsNone').click(function (e) {
    if(cvss4AttackRequirementsValue == "N"){
        cvss4AttackRequirementsValue = null;
    } else {
        $('#cvss4RequirementsPresent').removeClass("active");
        cvss4AttackRequirementsValue = "N";
    }
    computeCVSSv4();
});

$('#cvss4RequirementsPresent').click(function (e) {
    if(cvss4AttackRequirementsValue == "P"){
        cvss4AttackRequirementsValue = null;
    } else {
        $('#cvss4RequirementsNone').removeClass("active");
        cvss4AttackRequirementsValue = "P";
    }
    computeCVSSv4();
});

$('#cvss4PrivilegesNone').click(function (e) {
    if(cvss4PrivilegeRequiredValue == "N"){
        cvss4PrivilegeRequiredValue = null;
    } else {
        $('#cvss4PrivilegesLow').removeClass("active");
        $('#cvss4PrivilegesHigh').removeClass("active");
        cvss4PrivilegeRequiredValue = "N";
    }
    computeCVSSv4();
});

$('#cvss4PrivilegesLow').click(function (e) {
    if(cvss4PrivilegeRequiredValue == "L"){
        cvss4PrivilegeRequiredValue = null;
    } else {
        $('#cvss4PrivilegesNone').removeClass("active");
        $('#cvss4PrivilegesHigh').removeClass("active");
        cvss4PrivilegeRequiredValue = "L";
    }
    computeCVSSv4();
});

$('#cvss4PrivilegesHigh').click(function (e) {
    if(cvss4PrivilegeRequiredValue == "H"){
        cvss4PrivilegeRequiredValue = null;
    } else {
        $('#cvss4PrivilegesNone').removeClass("active");
        $('#cvss4PrivilegesLow').removeClass("active");
        cvss4PrivilegeRequiredValue = "H";
    }
    computeCVSSv4();
});

$('#cvss4UserInteractionNone').click(function (e) {
    if(cvss4UserInteractionValue == "N"){
        cvss4UserInteractionValue = null;
    } else {
        $('#cvss4UserInteractionPassive').removeClass("active");
        $('#cvss4UserInteractionActive').removeClass("active");
        cvss4UserInteractionValue = "N";
    }
    computeCVSSv4();
});

$('#cvss4UserInteractionPassive').click(function (e) {
    if(cvss4UserInteractionValue == "P"){
        cvss4UserInteractionValue = null;
    } else {
        $('#cvss4UserInteractionNone').removeClass("active");
        $('#cvss4UserInteractionActive').removeClass("active");
        cvss4UserInteractionValue = "P";
    }
    computeCVSSv4();
});

$('#cvss4UserInteractionActive').click(function (e) {
    if(cvss4UserInteractionValue == "A"){
        cvss4UserInteractionValue = null;
    } else {
        $('#cvss4UserInteractionNone').removeClass("active");
        $('#cvss4UserInteractionPassive').removeClass("active");
        cvss4UserInteractionValue = "A";
    }
    computeCVSSv4();
});

$('#cvss4ConfidentialityNone').click(function (e) {
    if(cvss4ConfidentialityValue == "N"){
        cvss4ConfidentialityValue = null;
    } else {
        $('#cvss4ConfidentialityLow').removeClass("active");
        $('#cvss4ConfidentialityHigh').removeClass("active");
        cvss4ConfidentialityValue = "N";
    }
    computeCVSSv4();
});

$('#cvss4ConfidentialityLow').click(function (e) {
    if(cvss4ConfidentialityValue == "L"){
        cvss4ConfidentialityValue = null;
    } else {
        $('#cvss4ConfidentialityNone').removeClass("active");
        $('#cvss4ConfidentialityHigh').removeClass("active");
        cvss4ConfidentialityValue = "L";
    }
    computeCVSSv4();
});

$('#cvss4ConfidentialityHigh').click(function (e) {
    if(cvss4ConfidentialityValue == "H"){
        cvss4ConfidentialityValue = null;
    } else {
        $('#cvss4ConfidentialityNone').removeClass("active");
        $('#cvss4ConfidentialityLow').removeClass("active");
        cvss4ConfidentialityValue = "H";
    }
    computeCVSSv4();
});

$('#cvss4IntegrityNone').click(function (e) {
    if(cvss4IntegrityValue == "N"){
        cvss4IntegrityValue = null;
    } else {
        $('#cvss4IntegrityLow').removeClass("active");
        $('#cvss4IntegrityHigh').removeClass("active");
        cvss4IntegrityValue = "N";
    }
    computeCVSSv4();
});

$('#cvss4IntegrityLow').click(function (e) {
    if(cvss4IntegrityValue == "L"){
        cvss4IntegrityValue = null;
    } else {
        $('#cvss4IntegrityNone').removeClass("active");
        $('#cvss4IntegrityHigh').removeClass("active");
        cvss4IntegrityValue = "L";
    }
    computeCVSSv4();
});

$('#cvss4IntegrityHigh').click(function (e) {
    if(cvss4IntegrityValue == "H"){
        cvss4IntegrityValue = null;
    } else {
        $('#cvss4IntegrityNone').removeClass("active");
        $('#cvss4IntegrityLow').removeClass("active");
        cvss4IntegrityValue = "H";
    }
    computeCVSSv4();
});

$('#cvss4AvailabilityNone').click(function (e) {
    if(cvss4AvailabilityValue == "N"){
        cvss4AvailabilityValue = null;
    } else {
        $('#cvss4AvailabilityLow').removeClass("active");
        $('#cvss4AvailabilityHigh').removeClass("active");
        cvss4AvailabilityValue = "N";
    }
    computeCVSSv4();
});

$('#cvss4AvailabilityLow').click(function (e) {
    if(cvss4AvailabilityValue == "L"){
        cvss4AvailabilityValue = null;
    } else {
        $('#cvss4AvailabilityNone').removeClass("active");
        $('#cvss4AvailabilityHigh').removeClass("active");
        cvss4AvailabilityValue = "L";
    }
    computeCVSSv4();
});

$('#cvss4AvailabilityHigh').click(function (e) {
    if(cvss4AvailabilityValue == "H"){
        cvss4AvailabilityValue = null;
    } else {
        $('#cvss4AvailabilityNone').removeClass("active");
        $('#cvss4AvailabilityLow').removeClass("active");
        cvss4AvailabilityValue = "H";
    }
    computeCVSSv4();
});

$('#cvss4SubsequentConfidentialityNone').click(function (e) {
    if(cvss4SubsequentConfidentialityValue == "N"){
        cvss4SubsequentConfidentialityValue = null;
    } else {
        $('#cvss4SubsequentConfidentialityLow').removeClass("active");
        $('#cvss4SubsequentConfidentialityHigh').removeClass("active");
        cvss4SubsequentConfidentialityValue = "N";
    }
    computeCVSSv4();
});

$('#cvss4SubsequentConfidentialityLow').click(function (e) {
    if(cvss4SubsequentConfidentialityValue == "L"){
        cvss4SubsequentConfidentialityValue = null;
    } else {
        $('#cvss4SubsequentConfidentialityNone').removeClass("active");
        $('#cvss4SubsequentConfidentialityHigh').removeClass("active");
        cvss4SubsequentConfidentialityValue = "L";
    }
    computeCVSSv4();
});

$('#cvss4SubsequentConfidentialityHigh').click(function (e) {
    if(cvss4SubsequentConfidentialityValue == "H"){
        cvss4SubsequentConfidentialityValue = null;
    } else {
        $('#cvss4SubsequentConfidentialityNone').removeClass("active");
        $('#cvss4SubsequentConfidentialityLow').removeClass("active");
        cvss4SubsequentConfidentialityValue = "H";
    }
    computeCVSSv4();
});

$('#cvss4SubsequentIntegrityNone').click(function (e) {
    if(cvss4SubsequentIntegrityValue == "N"){
        cvss4SubsequentIntegrityValue = null;
    } else {
        $('#cvss4SubsequentIntegrityLow').removeClass("active");
        $('#cvss4SubsequentIntegrityHigh').removeClass("active");
        cvss4SubsequentIntegrityValue = "N";
    }
    computeCVSSv4();
});

$('#cvss4SubsequentIntegrityLow').click(function (e) {
    if(cvss4SubsequentIntegrityValue == "L"){
        cvss4SubsequentIntegrityValue = null;
    } else {
        $('#cvss4SubsequentIntegrityNone').removeClass("active");
        $('#cvss4SubsequentIntegrityHigh').removeClass("active");
        cvss4SubsequentIntegrityValue = "L";
    }
    computeCVSSv4();
});

$('#cvss4SubsequentIntegrityHigh').click(function (e) {
    if(cvss4SubsequentIntegrityValue == "H"){
        cvss4SubsequentIntegrityValue = null;
    } else {
        $('#cvss4SubsequentIntegrityNone').removeClass("active");
        $('#cvss4SubsequentIntegrityLow').removeClass("active");
        cvss4SubsequentIntegrityValue = "H";
    }
    computeCVSSv4();
});

$('#cvss4SubsequentAvailabilityNone').click(function (e) {
    if(cvss4SubsequentAvailabilityValue == "N"){
        cvss4SubsequentAvailabilityValue = null;
    } else {
        $('#cvss4SubsequentAvailabilityLow').removeClass("active");
        $('#cvss4SubsequentAvailabilityHigh').removeClass("active");
        cvss4SubsequentAvailabilityValue = "N";
    }
    computeCVSSv4();
});

$('#cvss4SubsequentAvailabilityLow').click(function (e) {
    if(cvss4SubsequentAvailabilityValue == "L"){
        cvss4SubsequentAvailabilityValue = null;
    } else {
        $('#cvss4SubsequentAvailabilityNone').removeClass("active");
        $('#cvss4SubsequentAvailabilityHigh').removeClass("active");
        cvss4SubsequentAvailabilityValue = "L";
    }
    computeCVSSv4();
});

$('#cvss4SubsequentAvailabilityHigh').click(function (e) {
    if(cvss4SubsequentAvailabilityValue == "H"){
        cvss4SubsequentAvailabilityValue = null;
    } else {
        $('#cvss4SubsequentAvailabilityNone').removeClass("active");
        $('#cvss4SubsequentAvailabilityLow').removeClass("active");
        cvss4SubsequentAvailabilityValue = "H";
    }
    computeCVSSv4();
});