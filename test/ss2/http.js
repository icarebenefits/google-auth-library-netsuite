// exports N/http and N/https module

var httpClientResponse = Object.create(Object);

var httpServerRequest = Object.create(Object);

var httpServerResponse = Object.create(Object);

var httpCacheDurations = {
    LONG: 'LONG',
    MEDIMUM: 'MEDIUM',
    SHORT: 'SHORT',
    UNIQUE: 'UNIQUE'
};

var httpMethods = {
    GET: 'GET',
    POST: 'POST',
    PUT: 'PUT',
    DELETE: 'DELETE'
}

function httpRequest(method, options) {
    // TBD
}

module.exports = {
    ClientResponse: httpClientResponse,
    ServerRequest: httpServerRequest,
    ServerResponse: httpServerResponse,
    request: function(options) {
        return httpRequest(options.method || 'GET', options);
    },
    get: httpRequest.bind('GET'),
    post: httpRequest.bind('POST'),
    put: httpRequest.bind('PUT'),
    delete: httpRequest.bind('DELETE'),
    CacheDuration: httpCacheDurations,
    Method: httpMethods
};