/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
'use strict';
var path = require('path');
var os = require('os');
var exec = require('child_process').exec;

var test = require('tape');
var mkdirp = require('mkdirp');
var rimraf = require('rimraf');

var src = path.join(__dirname, '..', 'node_modules', 'famous', 'src');
var binPath = path.join(__dirname, '..', 'bin', 'cmd.js');
var outDir = path.join(os.tmpdir(), 'famous-dist-generator', 'bin-' + Date.now());

test('bin: setup temp directory', function (t) {
  t.plan(1);
  mkdirp(outDir, function (err) {
    t.error(err, 'the output folder should be made without an error');
  });
});

test('bin: incorrect input', function (t) {
  t.plan(3);
  exec([binPath].join(' '), function (err, stdout, stderr) {
    t.equal(err.code, 1, 'The process should exit with code 1');
    t.equal(stderr, 'error: please provide both a src and a destination\n', 'Correct error message should be printed');
    t.equal(stdout, '', 'Nothing should be logged.');
  });
});

test('bin: build standalone/global', function (t) {
  t.plan(3);
  var dest = path.join(outDir, 'famous-standalone.js');
  exec([binPath, src, dest].join(' '), function (err, stdout, stderr) {
    t.error(err, 'No error returned.');
    t.equal(stderr, '', 'stderr should be empty string');
    var successMsg = 'Successfully built Global famous\n';
    t.equal(stdout, successMsg, 'Printed success message.');
  });
});

test('bin: build standalone/global minified', function (t) {
  t.plan(3);
  var dest = path.join(outDir, 'famous-standalone.min.js');
  exec([binPath, src, dest, '-m'].join(' '), function (err, stdout, stderr) {
    t.error(err, 'No error returned.');
    t.equal(stderr, '', 'stderr should be empty string');
    var successMsg = 'Successfully built Global famous\n';
    t.equal(stdout, successMsg, 'Printed success message.');
  });
});

test('bin: build CommonJS version', function (t) {
  t.plan(3);
  var dest = path.join(outDir, 'common');
  exec([binPath, src, dest, '--common'].join(' '), function (err, stdout, stderr) {
    t.error(err, 'No error returned.');
    t.equal(stderr, '', 'stderr should be empty string');
    var successMsg = 'Successfully built CommonJS famous\n';
    t.equal(stdout, successMsg, 'Printed success message.');
  });
});

test('bin: build AMD version', function (t) {
  t.plan(3);
  var dest = path.join(outDir, 'famous.js');
  exec([binPath, src, dest, '--amd'].join(' '), function (err, stdout, stderr) {
    t.error(err, 'No error returned.');
    t.equal(stderr, '', 'stderr should be empty string');
    var successMsg = 'Successfully built AMD famous\n';
    t.equal(stdout, successMsg, 'Printed success message.');
  });
});

test('bin: build AMD version minified', function (t) {
  t.plan(3);
  var dest = path.join(outDir, 'famous.js');
  exec([binPath, src, dest, '--amd', '--minify'].join(' '), function (err, stdout, stderr) {
    t.error(err, 'No error returned.');
    t.equal(stderr, '', 'stderr should be empty string');
    var successMsg = 'Successfully built AMD famous\n';
    t.equal(stdout, successMsg, 'Printed success message.');
  });
});

test('bin: copy famous.css for specific version', function (t) {
  t.plan(3);
  var dest = path.join(outDir);
  exec([binPath, src, dest, '--css'].join(' '), function (err, stdout, stderr) {
    t.error(err, 'No error returned.');
    t.equal(stderr, '', 'stderr should be empty string');
    var successMsg = 'All Done Copying Famo.us CSS\n';
    t.equal(stdout, successMsg, 'Printed success message.');
  });
});

test('bin: teardown', function (t) {
  t.plan(1);
  rimraf(outDir, function (err) {
    t.error(err, 'the folder should be removed without an error');
  });
});
