#!/usr/bin/env node
/*eslint no-process-exit:0*/
'use strict';
var argv = require('minimist')(process.argv.slice(2));
var lib = require('../lib');

console.log('argv:', argv);
console.log('lib:', lib);

process.exit(0);
