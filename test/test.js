'use strict';
var test = require('tape');
var lib = require('../lib');
var os = require('os');
var path = require('path');
var fs = require('fs');

var convert = lib.convert;
var writeCommonJS = lib.writeCommonJS;
var writeStandalone = lib.writeStandalone;

test('convert', function (t) {
  t.plan(2);

  convert('0.2.1', function(err, commonjs) {
    t.error(err, 'No error returned');
    t.equal(typeof commonjs, 'object', 'commonjs is of type object');
  });
});

test('write CommonJS version', function (t) {
  t.plan(1);
  var version = '0.2.1';
  var tempDir = path.join(os.tmpdir(), ['test-famous-commonjs', version, Date.now()].join('-'));
  writeCommonJS(version, tempDir, function(err) {
    t.error(err, 'No error returned');
  });
});

test('write standalone global window.famous version', function (t) {
  t.plan(2);
  var version = '0.2.1';
  var destination = path.join(os.tmpdir(), ['famous', version, Date.now() + '.js'].join('-'));
  writeStandalone(version, destination, function(err) {
    t.error(err, 'No error returned');
    fs.exists(destination, function(exists) {
      t.ok(exists, 'famous.js exists');
    });
  });
});
