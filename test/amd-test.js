/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
'use strict';

var path = require('path');
var os = require('os');
var fs = require('fs');

var test = require('tape');
var mkdirp = require('mkdirp');
var rimraf = require('rimraf');

// var virtualDom = require('./helpers/virtualDom');
// var runFamous = require('./helpers/runFamous');

var amd = require('../lib/amd');

var tmpdir = os.tmpdir();
var outDir = path.join(tmpdir, 'famous-dist-generator', 'amd-' + Date.now());
var outFile = path.join(outDir, 'famous.js');
var outFileMin = path.join(outDir, 'famous.min.js');

var famousSRC = path.join(__dirname, '..', 'node_modules', 'famous', 'src');

test('amd: setup temp directory', function (t) {
  t.plan(1);
  mkdirp(outDir, function (err) {
    t.error(err, 'the output folder should be made without an error');
  });
});

test('amd: build', function (t) {
  t.plan(2);
  amd(famousSRC, outFile, function (err) {
    t.error(err, 'the process should complete without an error');
    t.ok(fs.existsSync(outFile), 'famous.js should exist');
  });
});

test('amd: build minified', function (t) {
  t.plan(2);
  amd(famousSRC, outFileMin, true, function (err) {
    var big = fs.readFileSync(outFile, 'utf8');
    var small = fs.readFileSync(outFileMin, 'utf8');
    t.error(err, 'the process should complete without an error');
    t.ok(small.length < big.length, 'the minified version should be smaller');
  });
});

// test('amd: setup virtualdom', function (t) {
//   virtualDom(t);
// });
//
// test('amd: can be required', function (t) {
//   var famous = global.famous = require(outFile);
//   runFamous(famous, t);
// });

test('amd: teardown', function (t) {
  t.plan(1);
  rimraf(outDir, function (err) {
    t.error(err, 'the folder should be removed without an error');
  });
});
