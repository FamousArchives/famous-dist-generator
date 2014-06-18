famous-commonjs
===============

This module clones the famous/famous repo and converts it to a npm compatible 
CommonJS format.

Usage
-----

### API

```
var buildLib = require('famous-commonjs');
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
$ famous-command --standalone -ref 0.2.1 --minify --out ./famous-commonjs-0.2.1.js
```

Convert RequireJS-based Famous to CommonJS.
```
$ famous-command --commonjs -ref 0.2.1 --out ./famous-commonjs-0.2.1
```
