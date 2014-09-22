/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

'use strict';
var test = require('tape');
var lib = require('../lib');
// var os = require('os');
var path = require('path');
var fs = require('fs');
var temp = require('temp').track();
var async = require('async');

var fetchFamous = lib.fetchFamous;
var convert = lib.convert;
var writeCommonJS = lib.writeCommonJS;
var writeStandalone = lib.writeStandalone;
var writeRequireJS = lib.writeRequireJS;
var writeFamousCSS = lib.writeFamousCSS;

function makeCheckoutTest(ref) {
  return function (t) {
    var currentFamousModules = require('./famous-modules-' + ref + '.json');
    t.plan(2 + currentFamousModules.length);

    fetchFamous(ref, function(err, famous) {

      t.error(err, 'No error returned.');
      t.equal(typeof famous, 'object', 'fetchFamous returned object');

      currentFamousModules.forEach(function(key) {
        t.equal(typeof famous[key], 'string', key + ' exists.');
      });

    });
  };
}

test('valid semver', makeCheckoutTest('0.2.1'));
test('valid sha1 hash', makeCheckoutTest('6b2ad41b3c024a298d778e6344383d846ae7fa98'));

test('convert', function (t) {
  t.plan(2);

  convert('0.2.1', function(err, commonjs) {
    t.error(err, 'No error returned');
    t.equal(typeof commonjs, 'object', 'commonjs is of type object');
  });
});

test('write CommonJS version', function (t) {
  var expectedTopLevelFiles = require('./top-level-commonjs-files-and-folders.json');
  t.plan(1 + expectedTopLevelFiles.length);
  var version = '0.2.1';
  var tempDir = temp.path({prefix: 'famous-' + version});
  writeCommonJS(version, tempDir, function(err) {
    t.error(err, 'No error returned');
    async.each(expectedTopLevelFiles, function(file, done) {
      var filePath = path.join(tempDir, file);
      fs.exists(filePath, function(exists) {
        t.ok(exists, 'Top level file exists: ' + file);
        done();
      });
    }, temp.cleanupSync);
  });
});

test('write standalone global window.famous version', function (t) {
  t.plan(2);
  var version = '0.2.1';
  var destination = temp.path({prefix: 'famous-' + version, suffix: '.js'});
  writeStandalone(version, destination, function(err) {
    t.error(err, 'No error returned');
    fs.exists(destination, function(exists) {
      t.ok(exists, 'famous.js exists');
      temp.cleanupSync();
    });
  });
});

test('write RequireJS version', function(t) {
  t.plan(2);
  var version = '0.2.1';
  var destination = temp.path({prefix: 'famous-' + version, suffix: '.js'});
  writeRequireJS(version, destination, function(err) {
    t.error(err, 'No error returned');
    fs.exists(destination, function(exists) {
      t.ok(exists, 'famous.js exists');
      temp.cleanupSync();
    });
  });
});

test('write famous.css', function(t) {
  t.plan(2);
  var version = '0.2.1';
  var destination = temp.path({prefix: 'famous-' + version, suffix: '.css'});
  writeFamousCSS(version, destination, function(err) {
    t.error(err, 'No error returned');
    fs.exists(destination, function(exists) {
      t.ok(exists, 'famous.css exists');
      temp.cleanupSync();
    });
  });
});
