#!/usr/bin/env node
/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/*eslint no-process-exit:0*/
'use strict';
process.title = 'famous-dist-builder';

var argv = require('minimist')(process.argv.slice(2));
var extname = require('path').extname;

function help() {
  console.log('Famous Distriubtion Generator');
  console.log('usage: famous-dist-generator path-to-src path-to-output [options]');
  console.log('----------------');
  console.log('options');
  console.log('----------------');
  console.log('--amd  Build a single JavaScript file utilizing the AMD api supported by amd');
  console.log('--common  Minify output');
  console.log('--minify  Minify output');
}

if (argv._.length < 2) {
  console.error('error: please provide both a src and a destination');
  process.exit(1);
}

if (argv.css && extname(argv._[1]) !== '') {
  console.error('For CSS builds you must provide an output that is a folder');
  process.exit(1);
}
else if (!argv.common && !argv.css && extname(argv._[1]) !== '.js') {
  console.error('For AMD and Standalone builds you must provide an output that has a .js extension');
  process.exit(1);
}
else if (argv.common && extname(argv._[1]) !== '') {
  console.error('For commonJS builds you must provide an output that is a folder');
  process.exit(1);
}

if (argv._.indexOf('help') > 0 || argv.h === true || argv.help === true || (argv._.length === 0 && Object.keys(argv).length === 1)) {
  help();
  process.exit(0);
}

var lib = require('../lib');

var common = lib.common;
var standalone = lib.standalone;
var amd = lib.amd;
var css = lib.css;

var minify = argv.m || argv.minify;
var src = argv._[0];
var dest = argv._[1];

if (argv.amd) {
  amd(src, dest, minify, function (err) {
    if (err) {
      console.error(new Error(err));
      process.exit(1);
    }
    console.log('Successfully built AMD famous');
    process.exit(0);
  });
}
else if (argv.common) {
  common(src, dest, function (err) {
    if (err) {
      console.error(new Error(err));
      process.exit(1);
    }
    console.log('Successfully built CommonJS famous');
    process.exit(0);
  });
}
else if (argv.css) {
  css(src, dest, function (err) {
    if (err) {
      console.error(new Error(err));
      process.exit(1);
    }
    console.log('All Done Copying Famo.us CSS');
    process.exit(0);
  });
}
else {
  standalone(src, dest, minify, function (err) {
    if (err) {
      console.error(new Error(err));
      process.exit(1);
    }
    console.log('Successfully built Global famous');
    process.exit(0);
  });
}
