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

test('standalone: setup temp directory', function (t) {
  t.plan(1);
  mkdirp(outDir, function (err) {
    t.error(err, 'the output folder should be made without an error');
  });
});

test('standalone: exports', function (t) {
  t.plan(1);
  standalone(famousSRC, outFile, function (err) {
    t.error(err, 'the process should work without an error');
  });
});

test('standalone: setup virtualdom', function (t) {
  var jsdom = require('jsdom').jsdom;
  var document = global.document = jsdom('hello famo.us');
  var window = global.window = document.parentWindow;
  var navigator = global.navigator = require('navigator');
  var raf = global.window.requestAnimationFrame = require('raf');
  t.plan(3);
  t.ok(window, 'the virtual dom is set up');
  t.ok(navigator, 'we have shimmed navigator');
  t.ok(raf, 'we have shimmed requestAnimationFrame');
});

test('standalone: can be required', function (t) {
  t.plan(5);
  var famous = global.famous = require(outFile);
  var core = famous.core;
  var Engine = core.Engine;
  t.ok(famous, 'the module is required as expected');
  t.ok(core, 'the module has a core object');
  t.ok(Engine, 'the module exposes the engine');
  t.equal(Engine.getOptions('runLoop'), true, 'the engine should be running');
  Engine.setOptions({
    runLoop: false
  });
  t.equal(Engine.getOptions('runLoop'), false, 'the engine should no longer be running after being turned off');
});

test('standalone: teardown', function (t) {
  t.plan(1);
  rimraf(outDir, function (err) {
    t.error(err, 'the folder should be removed without an error');
  });
});
