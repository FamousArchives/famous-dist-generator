/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
'use strict';
var fs = require('fs');
var join = require('path').join;

function css(src, dest, cb) {
  var readSteam = fs.createReadStream(join(src, 'core', 'famous.css'));
  var writeStream = fs.createWriteStream(join(dest, 'famous.css'));
  writeStream.on('finish', cb);
  readSteam.pipe(writeStream);
}

module.exports = css;
