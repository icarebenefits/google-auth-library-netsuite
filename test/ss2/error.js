// define N/error module

var util = require('util');


function toErrorString() {
    return '[' + (this.name || 'UNKNOWN_ERROR') + ']' + 
        (this.message || '');
}

var SuiteScriptError = Object.create(Error);
SuiteScriptError.prototype.toString = toErrorString;

var UserEventError = Object.create(Error);
UserEventError.prototype.toString = toErrorString;

function createError(options) {
    var error = new SuiteScriptError(options.message);
    error.name = options.name || 'UNKNOWN_ERROR';
    return error;
}

module.exports = {
    SuiteScriptError: SuiteScriptError,
    UserEventError: UserEventError,
    create: createError
};