famous-convert
==============

This module clones the famous/famous repo and converts it to a npm compatible 
CommonJS format.

Usage
-----

### API

```
var buildLib = require('famous-convert');
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
$ famous-convert --standalone -ref 0.2.1 --minify --out ./famous-standalone-0.2.1.js
```

Build a single JavaScript file that apes the legacy single file RequireJS version

``` 
$ famous-convert --requirejs -ref 0.2.1 --minify --out ./famous-requirejsg-0.2.1.js
```

Convert RequireJS-based Famous to CommonJS.

```
$ famous-convert --commonjs -ref 0.2.1 --out ./famous-commonjs-0.2.1
```

Get the famous.css file for a specific version

```
$ famous-convert --css -ref 0.2.1 --out ./famous-0.2.1.css
```

If you want to use a different Github repo URL to make Famo.us from, just set 
the `FAMOUS_GITHUB_REPO_URL` environment variable. The default value is 
`'git@github.com:Famous/famous.git'`.
