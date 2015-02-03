/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
'use strict';

var commonGround = require('common-ground');
// var indexFinger = require('index-finger');

function common(src, dist, cb) {
  commonGround.convertDir(src, dist, function (err) {
    cb(err);
  });
}

module.exports = common;
