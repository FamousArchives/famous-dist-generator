famous-dist-generator
==============

[![Build Status](https://travis-ci.org/FamousTools/famous-dist-generator.svg?branch=master)](https://travis-ci.org/FamousTools/famous-dist-generator) [![Dependency Status](https://david-dm.org/FamousTools/famous-dist-generator.svg)](https://david-dm.org/FamousTools/famous-dist-generator) [![devDependency Status](https://david-dm.org/FamousTools/famous-dist-generator/dev-status.svg)](https://david-dm.org/FamousTools/famous-dist-generator#info=devDependencies)

This module clones the famous/famous repo and convert it to a npm compatible 
CommonJS format.

Usage
-----

### API

```
var buildLib = require('famous-dist-generator');
var path = require('path');

var ref = '6b2ad41b3c024a298d778e6344383d846ae7fa98';
var out = path.join(process.cwd(), 'famous-' + ref);


buildLib.writeCommonJS(ref, out, function(err) {
    if (err) { return console.error(err); }
    // do something here.
});

var minify = true;

buildLib.writeStandalone(ref, out, minify, function(err) {
    if (err) { return console.error(err); }
    // do something here.
});

```

### CLI

Build a single JavaScript file that defines a `famous` property on `window`

``` 
$ famous-dist-generator --standalone --ref 0.2.1 --minify --out ./famous-standalone-0.2.1.js
```

Build a single JavaScript file that apes the legacy single file RequireJS version

``` 
$ famous-dist-generator --requirejs --ref 0.2.1 --minify --out ./famous-requirejs-0.2.1.js
```

dist-generator RequireJS-based Famous to CommonJS.

```
$ famous-dist-generator --commonjs --ref 0.2.1 --out ./famous-commonjs-0.2.1
```

Get the famous.css file for a specific version

```
$ famous-dist-generator --css --ref 0.2.1 --out ./famous-0.2.1.css
```

If you want to use a different Github repo URL to make Famo.us from, just set 
the `FAMOUS_GITHUB_REPO_URL` environment variable. The default value is 
`'git@github.com:Famous/famous.git'`.
