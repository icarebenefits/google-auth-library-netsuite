'use strict';
var Transform = require('stream').Transform;
var fs = require('fs');
var path = require('path');
var libDir = path.resolve(__dirname, '..') + '/lib/ss/';
var ssVersion = process.env.SUITESCRIPT_VERSION;
var browserifyIstanbul = require('browserify-istanbul');

module.exports = function (file) {
  var stream = new Transform();
  // console.error('[NS] transforming ' + file);
  var isEntryPoint = !!file.match(/[\/\\]lib[\/\\]auth[\/\\]googleauth\.js$/);
  stream._transform = function (data, encoding, callback) {
    if (file.indexOf(libDir) === 0) {
      var libSS = file.substring(0, libDir.length - 1) + ssVersion;
      var replace = libSS + '/' + file.substring(libDir.length);
      if (fs.existsSync(replace)) {
        // console.error('Replacing ' + file + ' with ' + replace);
        data = fs.readFileSync(replace);
        file = replace;
      }
    }

    if (process.env.COVERAGE === '1') {
      var bi = browserifyIstanbul(file);
      var biData = '';
      bi.on('data', function(chunk) {
         biData += chunk;
      });
      bi.on('end', function() {
        data = biData;
      });
      bi.end(data);
    }

    this.push(data);

    if (isEntryPoint) {
      this.push('module.exports.prototype.NS = NS;\nNS.GoogleAuth = module.exports;');
    }

    callback();
  };

  return stream;
};