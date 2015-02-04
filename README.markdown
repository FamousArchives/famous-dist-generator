famous-dist-generator
==============

[![Build Status](https://travis-ci.org/FamousTools/famous-dist-generator.svg?branch=master)](https://travis-ci.org/FamousTools/famous-dist-generator) [![Dependency Status](https://david-dm.org/FamousTools/famous-dist-generator.svg)](https://david-dm.org/FamousTools/famous-dist-generator) [![devDependency Status](https://david-dm.org/FamousTools/famous-dist-generator/dev-status.svg)](https://david-dm.org/FamousTools/famous-dist-generator#info=devDependencies)

This module allows you to convert Famo.us to the various ways it is consumed in production. It is generic enough that it should be able to work for any project that is architected in a similar

Usage
-----

### API

```
var distGenerator = require('famous-dist-generator');
var path = require('path');

var src = path.join(path-to-famous, 'src');
var dest = path.join(process.cwd(), 'famous.js');
distGenerator.standalone(src, dest, function (err) {
    if (err) { return console.error(new Error(err)); }
    //do something
});

var minify = true;

distGenerator.standalone(src, dest, minify, function (err) {
    if (err) { return console.error(new Error(err)); }
    //do something
});

```

### CLI

Build a single JavaScript file that supports AMD, commonJS, and a global object version of famous

``` 
$ famous-dist-generator path-to-src path-to-output/famous-global.js
```

Build a single JavaScript file utilizing the AMD api supported by RequireJS

``` 
$ famous-dist-generator --amd path-to-src path-to-output/famous.js
```

Convert the entire src directory from AMD to common (output is a folder that is ready to publish to npm)

```
$ famous-dist-generator --common path-to-src path-to-output/
```

Copy famous.css from the src folder to your output folder

```
$ famous-dist-generator --css path-to-src path-to-output
```
