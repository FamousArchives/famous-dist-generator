#!/usr/bin/env node
/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/*eslint no-process-exit:0*/
'use strict';
process.title = 'famous';
var argv = require('minimist')(process.argv.slice(2));
var lib = require('../lib');
var writeCommonJS = lib.writeCommonJS;
var writeStandalone = lib.writeStandalone;
var writeRequireJS = lib.writeRequireJS;
var writeFamousCSS = lib.writeFamousCSS;
var path = require('path');

function getValue(keys, defaultValue) {
  var value;
  for (var i = 0, len = keys.length; i < len; i++) {
    if (!value) {
      value = argv[keys[i]];
    }
  }
  return value ? value : defaultValue;
}

var ref = getValue(['ref', 'r', 'version', 'v', 'tag', 't', 'branch', 'b'], 'master');
var out = getValue(['out', 'o'], undefined);
var minify = getValue(['minify', 'm'], false);

var buildType = '';

if (argv.commonjs) {
  buildType = 'commonjs';
} else if (argv.standalone) {
  buildType = 'global';
} else if (argv.requirejs) {
  buildType = 'requirejs';
}

if (!out) {
  var filename = 'famous-';
  if (buildType !== '' && buildType !== 'requirejs') { filename += [buildType, '-'].join(''); }
  filename += ref;
  if (!argv.commonjs && !argv.css) {
    filename += '.js';
  }
  else if (argv.css) {
    filename += '.css';
  }
  out = path.join(process.cwd(), filename);
}

// function build (type, builder, ref, out) {
//   builder(ref, out, function(err) {
//     if (err) {
//       console.error('Failed to build %s famous for reference %s', type, ref);
//       console.error(err);
//       return process.exit(1);
//     }
//     console.log('Successfully built %s famous for reference %s', type, ref);
//     process.exit(0);
//   });
// }

function makeCallback(type) {
  return function (err) {
    if (err) {
      console.error('Failed to build %s famous for reference %s', type, ref);
      console.error(err);
      return process.exit(1);
    }
    console.log('Successfully built %s famous for reference %s', type, ref);
    process.exit(0);
  };
}

if (argv.commonjs) {
  writeCommonJS(ref, out, makeCallback('CommonJS'));
} else if (argv.standalone) {
  writeStandalone(ref, out, minify, makeCallback('standalone'));
} else if (argv.requirejs) {
  writeRequireJS(ref, out, minify, makeCallback('RequireJS'));
} else if (argv.css) {
  writeFamousCSS(ref, out, minify, makeCallback('stylesheet for'));
} else {
  console.log('Must specify either --commonjs for CommonJS or --standalone for window.famous.');
  process.exit(1);
}
