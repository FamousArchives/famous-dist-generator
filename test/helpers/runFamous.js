/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
'use strict';

function runFamous(famous, t) {
  t.plan(5);
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
}

module.exports = runFamous;
