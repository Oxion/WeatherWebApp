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

ParameterCheck.mandatoryFunction = function(paramName, paramValue) {
    ParameterCheck.mandatory(paramName, paramValue);

    if (typeof paramValue != "function") {
        throw new Error(`Parameter ${paramName} is not a function`);
    }
}

ParameterCheck.mandatoryNumber = function(paramName, paramValue, notNull) {
    ParameterCheck.mandatory(paramName, paramValue);

    if (typeof paramValue != "number") {
        throw new Error(`Parameter ${paramName} is not a number`);
    }

    if (notNull && paramValue == 0) {
        throw new Error(`Parameter ${paramName} can't be equal '0'`);
    }
}

module.exports = ParameterCheck;