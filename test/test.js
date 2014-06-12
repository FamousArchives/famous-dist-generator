'use strict';
var test = require('tape');

var lib = require('../lib');

test('base test', function (t) {
  t.plan(1);
  t.equal(lib, 'module exports');
});
