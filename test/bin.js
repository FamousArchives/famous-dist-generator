'use strict';
var test = require('tape');
var spawn = require('child_process').spawn;
var exec = require('child_process').exec;
var path = require('path');
var fs = require('fs');
var async = require('async');
var temp = require('temp').track();

var binPath = path.resolve(__dirname, '../bin/cmd.js');

// test('bin', function (t) {
//   t.plan(3);

//   var ps = spawn(binPath);
//   var stdout = '';
//   var stderr = '';
//   ps.stdout.on('data', function (buf) { stdout += buf; });
//   ps.stderr.on('data', function (buf) { stderr += buf; });

//   ps.on('exit', function (code) {
//     t.equal(code, 0, 'Process exited with code 0');
//     t.equal(stderr, '', 'No output on stderr');
//     t.equal(stdout, 'argv: { _: [] }\n', 'Correct output on stdout');
//   });
// });

test('build standalone/global `window.famous` version', function (t) {
  t.plan(4);
  var version = '6b2ad41b3c024a298d778e6344383d846ae7fa98';
  var outPath = temp.path({prefix: 'famous-', suffix: '.js'});
  exec([binPath, '--standalone', '--out', outPath, '--version', version].join(' '), function(err, stdout, stderr) {
    t.error(err, 'No error returned.');
    t.equal(stderr, '', 'stderr should be empty string');
    var successMsg = 'Successfully built standalone famous for reference ' + version + '\n';
    t.equal(stdout, successMsg, 'Printed success message.');
    fs.exists(outPath, function(exists) {
      t.ok(exists, 'famous.js exists at destination');
      temp.cleanupSync();
    });
  });
});

test('build concatenated RequireJS version', function (t) {
  t.plan(4);
  var version = '0.2.1';
  var outPath = temp.path({prefix: 'famous-', suffix: '.js'});
  exec([binPath, '--requirejs', '--out', outPath, '--version', version].join(' '), function(err, stdout, stderr) {
    t.error(err, 'No error returned.');
    t.equal(stderr, '', 'stderr should be empty string');
    var successMsg = 'Successfully built RequireJS famous for reference ' + version + '\n';
    t.equal(stdout, successMsg, 'Printed success message.');
    fs.exists(outPath, function(exists) {
      t.ok(exists, 'famous.js exists at destination');
      temp.cleanupSync();
    });
  });
});

test('build CommonJS version', function (t) {
  var expectedTopLevelFiles = require('./top-level-commonjs-files-and-folders.json');
  t.plan(3 + expectedTopLevelFiles.length);
  var version = '0.2.1';
  var outPath = temp.path({prefix: 'famous-' + version});
  exec([binPath, '--commonjs', '--out', outPath, '--version', version].join(' '), function(err, stdout, stderr) {
    t.error(err, 'No error returned.');
    t.equal(stderr, '', 'stderr should be empty string');
    var successMsg = 'Successfully built CommonJS famous for reference ' + version + '\n';
    t.equal(stdout, successMsg, 'Printed success message.');
    async.each(expectedTopLevelFiles, function(file, done) {
      var filePath = path.join(outPath, file);
      fs.exists(filePath, function(exists) {
        t.ok(exists, 'Top level file exists: ' + file);
        done();
      });
    }, temp.cleanupSync);
  });
});
