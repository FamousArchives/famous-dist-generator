#!/usr/bin/env node
/*eslint no-process-exit:0*/
'use strict';
process.title = 'famous';
var argv = require('minimist')(process.argv.slice(2));
var lib = require('../lib');
var writeCommonJS = lib.writeCommonJS;
var writeStandalone = lib.writeStandalone;
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

if (!out) {
  out = path.join(process.cwd(), 'famous-' + ref);
}

function build (type, builder, ref, out) {
  builder(ref, out, function(err) {
    if (err) {
      console.error('Failed to build %s famous for reference %s', type, ref);
      console.error(err);
      return process.exit(1);
    }
    console.log('Successfully built %s famous for reference %s', type, ref);
    process.exit(0);
  });
}

if (argv.commonjs) {
  build('CommonJS', writeCommonJS, ref, out);
} else if (argv.standalone) {
  build('standalone', writeStandalone, ref, out);
} else {
  console.log('Must specify either --common for CommonJS or --standalone for window.famous.');
  process.exit(1);
}
