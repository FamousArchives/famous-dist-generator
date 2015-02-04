/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
'use strict';
var fs = require('fs');
var path = require('path');
var join = path.join;

var commonGround = require('common-ground');
var indexFinger = require('index-finger');

var licenseHeader = fs.readFileSync(join(__dirname, '..', 'templates', 'mit-license-header.txt'), 'utf8');

var extras = [
  'AUTHORS',
  'CHANGELOG.md',
  'CONTRIBUTING.md',
  'LICENSE',
  'package.json',
  'README.md'
];

function common(src, dest, cb) {
  commonGround.convertDir(src, dest, licenseHeader, function (err) {
    if (err) { return cb(err); }
    extras.map(function(file) {
      fs.createReadStream(join(src, '..', file)).pipe(fs.createWriteStream(join(dest, file)));
    });
    indexFinger(dest, cb);
  });
}

module.exports = common;
