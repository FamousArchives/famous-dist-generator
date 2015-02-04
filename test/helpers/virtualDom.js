/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
'use strict';

function virtualDom(t) {
  var jsdom = require('jsdom').jsdom;
  var document = global.document = jsdom('hello famo.us');
  var widow = global.window = document.parentWindow;
  var navigator = global.navigator = require('navigator');
  var raf = global.window.requestAnimationFrame = require('raf');
  t.plan(3);
  t.ok(window, 'the virtual dom is set up');
  t.ok(navigator, 'we have shimmed navigator');
  t.ok(raf, 'we have shimmed requestAnimationFrame');
}

module.exports = virtualDom;
