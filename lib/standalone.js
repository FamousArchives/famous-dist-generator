/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

'use strict';
var os = require('os');
var path = require('path');
var fs = require('fs');

var browserify = require('browserify');
var indexFinger = require('index-finger');
var derequire = require('derequire');

function build(index, cb) {
  var b = browserify({
    standalone: 'Famous'
  });
  b.transform(path.join(__dirname, '..', 'node_modules', 'deamdify'));
  b.add(index);
  b.bundle(cb);
}

function standalone(src, dest, cb) {
  var outputDir = path.join(os.tmpdir(), 'famous-build-' + Date.now().toString());
  var index = path.join(outputDir, 'index.js');

  indexFinger(src, outputDir, function (err) {
    if (err) {
      return cb(err);
    }
    build(index, function (error, bundle) {
      if (error) {
        return cb(error);
      }

      bundle = derequire(bundle, '_dereq_', 'require');
      fs.writeFile(dest, bundle, cb);
    });
  });
}

module.exports = standalone;
