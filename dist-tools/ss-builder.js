#!/usr/bin/env node
var path = require('path'),
    viralify = require('viralify');
// var GoogleAuth = require('../');
var license = [
  '// Google Authentication Library for SuiteScript',
  '// Copyright iCareBenefits.com, Inc. or its affiliates. All Rights Reserved.',
  '// License at http://www.apache.org/licenses/LICENSE-2.0'
].join('\n') + '\n';
var prefixes = {
  '2': [
    'define([\'N/xml\', \'N/http\', \'N/https\', \'N/error\', \'N/log\'], function(nsXml, nsHttp, nsHttps, nsError, nsLog) {',
    '  var NS = {',
    '    xml: nsXml, http: nsHttp, https: nsHttps, error: nsError, log: nsLog,',
    '    VERSION: 2',
    '  };',
    '  var define = undefined;', 		// hide NetSuite define() function,
    //'  var global = {};',				// fake global object
  ].join('\n') + '\n'
};
var suffixes = {
  '2': [
    '  return new NS.GoogleAuth();',
    '}); // end of NetSuite define()'
  ].join('\n') + '\n'
};
function minify(code) {
  var uglify = require('uglify-js');
  var minified = uglify.minify(code, { fromString: true });
  return minified.code;
}
function stripComments(code) {
  var lines = code.split(/\r?\n/);
  var multiLine = false;
  lines = lines.map(function (line) {
    var rLine = line;
    if (line.match(/^\s*\/\//)) {
      rLine = null;
    } else if (line.match(/^\s*\/\*/)) {
      multiLine = true;
      rLine = null;
    }
    if (multiLine) {
      var multiLineEnd = line.match(/\*\/(.*)/);
      if (multiLineEnd) {
        multiLine = false;
        rLine = multiLineEnd[1];
      } else {
        rLine = null;
      }
    }
    return rLine;
  }).filter(function (l) {
    return l !== null;
  });
  var newCode = lines.join('\n');
  newCode = newCode.replace(/\/\*\*[\s\S]+?Copyright\s+.+?Google[\s\S]+?\*\//g, '');
  return newCode;
}
function build(options, callback) {
  if (arguments.length === 1) {
    callback = options;
    options = {};
  }
  // default version is SuiteScript 2.0
  if (!options.version) {
    options.version = '2';
  }
  // set browserify-swap environment
  process.env.BROWSERIFYSWAP_ENV = 'bundle';
  if (!process.env.SUITESCRIPT_VERSION) process.env.SUITESCRIPT_VERSION = options.version;
  var img = require('insert-module-globals');
  img.vars.process = function () {
    return '{browser:false}';
  };
  // create browser bundle
  var browserify = require('browserify');
  var brOpts = { 
		  basedir: path.resolve(__dirname, '..')
		};
  // viralify ss-transform.js
  var pkg = require(brOpts.basedir + '/package.json');
  viralify.sync(brOpts.basedir, pkg['browserify-swap']['@packages'], brOpts.basedir + '/dist-tools/ss-transform.js', true);
  
  browserify(brOpts).add('./').bundle(function (err, data) {
    if (err)
      return callback(err);
    var code = (data || '').toString();
    if (options.minify)
      code = minify(code);
    else
      code = stripComments(code);
    var prefix = prefixes[options.version] ? prefixes[options.version] : '';
    var suffix = suffixes[options.version] ? suffixes[options.version] : '';
    code = license + prefix + code + suffix;
    callback(null, code);
  });
}
// run if we called this tool directly
if (require.main === module) {
  var opts = {
    version: process.argv[2] || '2',
    minify: process.env.MINIFY ? true : false
  };
  build(opts, function (err, code) {
    if (err)
      console.error(err.message);
    else
      console.log(code);
  });
}
build.license = license;
module.exports = build;