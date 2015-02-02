/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

'use strict';

var path = require('path');
var os = require('os');

var test = require('tape');
var mkdirp = require('mkdirp');
var rimraf = require('rimraf');

var tmpdir = os.tmpdir();
var outDir = path.join(tmpdir, 'famous-dist-generator', 'standalone');
var outFile = path.join(outDir, 'famous-standalone.js');

var standalone = require('../lib/standalone');

var famousSRC = path.join(__dirname, '..', 'node_modules', 'famous', 'src');

test('standalone: setup', function (t) {
  t.plan(1);
  mkdirp(outDir, function (err) {
    t.error(err, 'the folder should be made without an error');
  });
});

test('standalone: exports', function (t) {
  t.plan(1);
  standalone(famousSRC, outFile, function (err) {
    t.error(err, 'the process should work without an error');
  });
});

// test('standalone: can be required', function (t) {
//   t.plan(1);
//   var famous = require(outFile);
//   t.ok(famous);
// });

test('standalone: cleanup', function (t) {
  t.plan(1);
  rimraf(outDir, function (err) {
    t.error(err, 'the folder should be removed without an error');
  });
});
