var Transform = require('stream').Transform;
var license = require('./ss-builder').license;
var fs = require('fs');
var path = require('path');
var libDir = path.resolve(__dirname, '..') + '/lib/ss/';
var ssVersion = process.env.SUITESCRIPT_VERSION;
module.exports = function (file) {
  var stream = new Transform();
  // console.error('[NS] transforming ' + file);
  var isEntryPoint = !!file.match(/[\/\\]lib[\/\\]auth[\/\\]googleauth\.js$/);
  stream._transform = function (data, encoding, callback) {
    if (file.indexOf(libDir) == 0) {
      var replace = file.substring(0, libDir.length - 1) + ssVersion + '/' + file.substring(libDir.length);
      if (fs.existsSync(replace)) {
        // console.error('Replacing ' + file + ' with ' + replace);
        data = fs.readFileSync(replace);
      }
    }
    if (isEntryPoint) {
    	data += 'module.exports.prototype.NS = NS;\nNS.GoogleAuth = module.exports;';
    }
    callback(null, data);
  };
  return stream;
};