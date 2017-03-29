// implementation of request module
/**
 * create options for http/https request 
 * @param uri string
 * @param opts array
 * @returns array
 */
function createHttpParams(uri, opts) {
  // encode body
  var data;
  if (opts.form) {
    opts.headers['Content-Type'] = 'application/x-www-form-urlencoded';
    data = '';
    for (var param in opts.form) {
      data += encodeURIComponent(param) + '=' + encodeURIComponent(opts.form[param]) + '&';
    }
  } else if (opts.json && opts.body) {
    opts.headers['Content-Type'] = 'application/json';
    var type = typeof opts.body;
    if (type == 'string') {
      data = opts.body;
    } else if (type == 'Buffer') {
      data = opts.body.toJSON();
    } else {
      throw NS.error.create({
        name: 'REQUEST_INPUT_ERROR',
        message: 'Unknown request body type: ' + type + '\n' + opts.body
      });
    }
  }
  return {
    url: uri,
    method: opts.method ? opts.method : 'GET',
    headers: opts.headers,
    body: data
  };
}
/**
 * 
 * @param response N.http.ClientResponse
 * @returns
 */
function wrapResponse(response) {
  return {
    statusCode: response.code,
    headers: response.headers,
    nsResponse: response
  };
}
/**
 * 
 * @param callback function
 * @param title message
 * @param message message
 * @param uri string
 * @param opts array
 * @param response N.http.ClientResponse
 * @returns
 */
function reportRequestError(callback, title, message, uri, opts, response) {
  var errorMsg = message + '\n' + uri + '\n' + JSON.stringify(opts);
  if (response) {
    errorMsg += '\n' + response.body;
  }
  log.error(title, errorMsg, errorMsg);
  var res = response ? wrapResponse(response) : null;
  callback(new Error(title + ': ' + message), null, res);
}
/**
 * 
 * @param uri
 * @param opts
 * @param callback
 * @returns
 */
function httpRequest(uri, opts, callback) {
  var params = createHttpParams(uri, opts);
  if (NS._traceRequest) {
    NS._traceRequest('HTTP request ', JSON.stringify(params));
  }
  try {
    var module = uri.indexOf('http://') == 0 ? NS.http : NS.https;
    var response = module.request(params);
    if (NS._traceRequest) {
      NS._traceRequest('HTTP response ' + response.code, response.body);
    }
    var err = null;
    if (response.code !== 200) {
      reportRequestError(callback, 'Invalid status code: ' + response.code, response.body, uri, opts);
    } else {
      var body = response.body;
      if (opts.json) {
        body = JSON.parse(body);
      }
      // wrap response object
      var res = wrapResponse(response);
      callback(null, res, body);
    }
    return res;
  } catch (ex) {
    reportRequestError(callback, 'HTTP request: ' + ex.name, ex.message, uri, opts);
  }
}
module.exports = httpRequest;