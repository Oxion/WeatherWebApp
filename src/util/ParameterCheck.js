var ParameterCheck = {};

ParameterCheck.mandatory = function(paramName, paramValue) {
    if (paramValue == null || paramValue == undefined) {
        throw new Error(`Parameter ${paramName} is undefined`);
    }
}

ParameterCheck.mandatoryString = function(paramName, paramValue) {
    ParameterCheck.mandatory(paramName, paramValue);
    
    if (typeof paramValue != "string") {
        throw new Error(`Parameter ${paramName} is not a string`);
    }

    if (!paramValue) {
        throw new Error(`Parameter ${paramName} is empty string`);
    }
}

module.exports = ParameterCheck;