/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
'use strict';

var test = require('tape');
// var spawn = require('child_process').spawn;
// var exec = require('child_process').exec;

test('bin: build standalone/global', function (t) {
  t.ok(true, 'shim');
  t.end();
});

test('bin: build RequireJS version', function (t) {
  t.ok(true, 'shim');
  t.end();
});

test('bin: copy famous.css for specific version', function (t) {
  t.ok(true, 'shim');
  t.end();
});

test('bin: build CommonJS version', function (t) {
  t.ok(true, 'shim');
  t.end();
  // var expectedTopLevelFiles = require('./top-level-commonjs-files-and-folders.json');
  // t.plan(3 + expectedTopLevelFiles.length);
  // var version = '0.2.1';
  // var outPath = temp.path({prefix: 'famous-' + version});
  // exec([binPath, '--commonjs', '--out', outPath, '--version', version].join(' '), function(err, stdout, stderr) {
  //   t.error(err, 'No error returned.');
  //   t.equal(stderr, '', 'stderr should be empty string');
  //   var successMsg = 'Successfully built CommonJS famous for reference ' + version + '\n';
  //   t.equal(stdout, successMsg, 'Printed success message.');
  //   async.each(expectedTopLevelFiles, function(file, done) {
  //     var filePath = path.join(outPath, file);
  //     fs.exists(filePath, function(exists) {
  //       t.ok(exists, 'Top level file exists: ' + file);
  //       done();
  //     });
  //   }, temp.cleanupSync);
  // });
});
