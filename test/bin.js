'use strict';
var test = require('tape');
var spawn = require('child_process').spawn;
var path = require('path');

test('bin', function (t) {
  t.plan(3);

  var binPath = path.resolve(__dirname, '../bin/cmd.js');
  var ps = spawn(binPath);
  var stdout = '';
  var stderr = '';
  ps.stdout.on('data', function (buf) { stdout += buf; });
  ps.stderr.on('data', function (buf) { stderr += buf; });

  ps.on('exit', function (code) {
    t.equal(code, 0);
    t.equal(stderr, '');
    t.equal(stdout, 'argv: { _: [] }\nlib: module exports\n');
  });
});
