/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
'use strict';
var path = require('path');

var findit = require('findit');
var requirejs = require('requirejs');

function findModules(root, cb) {
  var finder = findit(root);
  var modules = [];
  finder.on('file', function (file) {
    if (path.extname(file) === '.js') {
      var base = path.basename(file, '.js');
      var relativePath = path.relative(root, path.dirname(file));
      var module = path.join('famous', relativePath, base);
      modules.push(module);
    }
  });
  finder.on('end', function () {
    modules.sort();
    cb(null, modules);
  });
  finder.on('error', function (err) {
    cb(err);
  });
}

// var requirejs = require('requirejs');
function amd(src, dest, minify, cb) {
  if (typeof minify === 'function') {
    cb = minify;
    minify = false;
  }

  findModules(src, function (err, modules) {
    if (err) { return cb(err); }
    var config = {
      baseUrl: src,
      paths: {
        'famous': ''
      },
      out: dest,
      include: modules,
      findNestedDependencies: true,
      optimize: 'none',
      wrap: false,
      normalizeDirDefines: 'all'
    };

    if (minify) {
      config.optimize = 'uglify2';
      config.uglify2 = {
        /*eslint-disable */
        ie_proof: false,
        /*eslint-enable */
        compress: {
          unsafe: true
        },
        mangle: {
          toplevel: true
        },
        warnings: true
      };
    }
    requirejs.optimize(config, function (result) {
      cb(null, result);
    });
  });
}

module.exports = amd;
