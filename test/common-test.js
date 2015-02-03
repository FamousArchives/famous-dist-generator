/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
'use strict';

var path = require('path');
var os = require('os');

var test = require('tape');
var mkdirp = require('mkdirp');
var rimraf = require('rimraf');

var virtualDom = require('./helpers/virtualDom');
var runFamous = require('./helpers/runFamous');

var tmpdir = os.tmpdir();
var outDir = path.join(tmpdir, 'famous-dist-generator', 'common-' + Date.now());

var common = require('../lib/common');

var famousSRC = path.join(__dirname, '..', 'node_modules', 'famous', 'src');

test('common: setup temp directory', function (t) {
  t.plan(1);
  mkdirp(outDir, function (err) {
    t.error(err, 'the output folder should be made without an error');
  });
});

test('common: build', function (t) {
  t.plan(1);
  common(famousSRC, outDir, function (err) {
    t.error(err, 'the process should complete without an error');
  });
});

test('common: setup virtualdom', function (t) {
  virtualDom(t);
});

test('common: can be required', function (t) {
  var famous = global.famous = require(outDir);
  runFamous(famous, t);
});

test('common: teardown', function (t) {
  t.plan(1);
  rimraf(outDir, function (err) {
    t.error(err, 'the folder should be removed without an error');
  });
});
