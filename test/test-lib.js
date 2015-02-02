/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

'use strict';
var test = require('tape');
var lib = require('../lib');

test('lib: exports', function(t) {
  t.plan(3);
  t.ok(lib.common, 'should contain a common function');
  t.ok(lib.amd, 'should contain a amd function');
  t.ok(lib.standalone, 'should contain a standalone function');
});
