/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

'use strict';

var clone = require('famous-git-cache').clone;
var convertAMDToCommonJS = require('browserify-ftw/lib/upgrade');
var async = require('async');
var path = require('path');
var fs = require('fs');
var mkdirp = require('mkdirp');
var handlebars = require('handlebars');
var extend = require('xtend');
var browserify = require('browserify');
var os = require('os');
var commondir = require('commondir');
var findit = require('findit');
var UglifyJS = require('uglify-js');
var CleanCSS = require('clean-css');
var requirejs = require('requirejs');

var famousGithubRepoURL = process.env.FAMOUS_GITHUB_REPO_URL || 'git@github.com:Famous/famous.git';

var licenseHeader = fs.readFileSync(path.join(__dirname, 'license-header.js'), 'utf8');

handlebars.registerHelper('csv', function (items, options) {
  if (!items) { return ''; }
  return items.map(options.fn).join(',\n');
});

function loadTemplateSync (filename) {
  var filepath = path.join(__dirname, filename);
  return handlebars.compile(fs.readFileSync(filepath, 'utf8'));
}

var indexJsTemplate = loadTemplateSync('index.js.hbs');
var packageJsonTemplate = loadTemplateSync('package.json.hbs');

function isDesiredFile (filepath) {
  return /\.js$/.test(filepath) &&
        filepath.indexOf('Gruntfile') === -1 &&
        filepath.indexOf('dist/') === -1 &&
        filepath.indexOf('examples/') === -1;
}

function getFamousModulePaths (famousPath, callback) {
  var modules = [];
  var finder = findit(famousPath);
  finder.on('file', function(file) {
    if (isDesiredFile(file) ) {
      modules.push(file);
    }
  });
  finder.on('error', callback);
  finder.on('end', function() {
    callback(undefined, modules);
  });
}

function readFamousModules (modulePaths, callback) {
  var famousDir = commondir(modulePaths);
  async.map(modulePaths, function(filepath, done) {
    fs.readFile(filepath, 'utf8', function(err, data) {
      if (err) { return done(err); }
      var hash = {};
      var key = path.relative(famousDir, filepath);
      key = key.slice(0, key.length - path.extname(key).length);
      hash[key] = data;
      done(undefined, hash);
    });
  }, function(err, hashes) {
    if (err) { return callback(err); }
    var finalHash = extend.apply({}, hashes);
    callback(undefined, finalHash);
  });
}

function fetchFamous (version, callback) {
  clone({
    repo: famousGithubRepoURL,
    ref: version
  }, function(err, famousPath) {
    if (err) { return callback(err); }
    getFamousModulePaths(famousPath, function(err, modulePaths) {
      if (err) { return callback(err); }
      readFamousModules(modulePaths, callback);
    });
  });
}

/**
 * This function walks the keys (e.g. core/Engine or physics/bodies/Particle)
 * and generates index.js files for each directory (e.g. core or physics/bodies)
 * based on the children in each directory (e.g. Engine or Particle).
 *
 * @param  {Object} commonjs Object hash with path keys and file content values.
 * @return {Object}          Object has of indices only.
 */
function makeIndices(commonjs) {
  var grouped = Object.keys(commonjs).reduce(function(memo, key) {
    var decomposed = key.split(path.sep);
    var namespace, item;

    while (decomposed.length > 0) {
      item = decomposed.pop();
      namespace = decomposed.join(path.sep);
      if (!memo[namespace]) {
        memo[namespace] = [];
      }
      if (memo[namespace].indexOf(item) === -1) {
        memo[namespace].push(item);
      }
    }
    return memo;
  }, {});

  var indices = Object.keys(grouped).reduce(function(memo, key) {
    memo[path.join(key, 'index')] = indexJsTemplate(grouped[key]);
    return memo;
  }, {});

  return indices;
}

/**
 * This function generates a function that is used by browserify-ftw to rewrite
 * the string literals in the require() call expressions.
 *
 * @param  {Number} depth   Folder depth of file relative to root of project.
 * @return {Function}       Function that receives a path and returns a path.
 */
function makeResolvePathFn(depth) {
  return function resolvePath(p) {
    if (p.indexOf('famous/') === 0) {
      var decomposed = p.split(path.sep);
      decomposed.shift();
      for (var i = 0; i < depth; i++) {
        decomposed.unshift('..');
      }
      return decomposed.join(path.sep);
    } else {
      return p;
    }
  };
}

/**
 * Takes a version number or git commit hash, fetches famo.us and then converts
 * famo.us from RequireJS to CommonJS. The callback to this functions receives a
 * POJO with keys representing paths to each file in the CommonJS project and
 * the values are the raw contents of the files in UTF-8.
 *
 * @param  {String}   version  [description]
 * @param  {Function} callback [description]
 */
function convert (version, callback) {
  fetchFamous(version, function(err, famous) {
    if (err) { return callback(err); }
    var codeStyleOptions = {
      quote: '\'',
      style: 'var',
      indent: 4
    };

    var commonjs = Object.keys(famous).reduce(function(memo, key) {
      var code = famous[key];
      var depth = key.split(path.sep).length - 1;
      var resolvePath = makeResolvePathFn(depth);
      memo[key] = convertAMDToCommonJS(code, codeStyleOptions, resolvePath).trim('\n');
      return memo;
    }, {});

    commonjs = extend(commonjs, makeIndices(commonjs));
    commonjs['package.json'] = packageJsonTemplate(version);
    callback(undefined, commonjs);
  });
}

function copyFilesFromFamousRepo (version, files, destDir, callback) {
  clone({
    repo: famousGithubRepoURL,
    ref: version
  }, function(err, famousPath) {
    if (err) { return callback(err); }
    async.each(files, function(file, done) {
      var filePath = path.join(famousPath, file);
      var exists = fs.existsSync(filePath);
      if (!exists) { filePath = path.join(famousPath, 'src', file); }
      fs.readFile(filePath, 'utf8', function(err, data) {
        if (err) { return done(err); }
        var destPath = path.join(destDir, file);
        mkdirp(path.dirname(destPath), function(err) {
          if (err) { return done(err); }
          fs.writeFile(destPath, data, 'utf8', done);
        });
      });
    }, callback);
  });
}

/**
 * Given a version (semver or git commit hash) and a destination, this fetches
 * famo.us in RequireJS format, converts it to CommonJS and writes it to disk at
 * the destination folder path passed in. This folder contains not only the
 * JavaScript files (including index.js), but also the README.markdown and
 * styles.css.
 *
 * @param  {String}   version     [description]
 * @param  {String}   destination [description]
 * @param  {Function} callback    [description]
 * @return {[type]}               [description]
 */
function writeCommonJS (version, destination, callback) {
  var err;
  if (!destination || typeof destination === 'function') {
    err = new Error('No destination provided');
    return callback(err);
  }

  fs.exists(destination, function (exists) {
    if (exists) {
      err = new Error('Destination already exists. Aborting.');
      return callback(err);
    } else {
      convert(version, function(err, commonjs) {
        if (err) { return callback(err); }
        async.each(Object.keys(commonjs), function(key, done) {
          var filepath = path.join(destination, key);
          if (path.extname(filepath) === '') {
            filepath = filepath + '.js';
          }
          var dirname = path.dirname(filepath);
          mkdirp(dirname, function(err) {
            if (err) { return done(err); }
            fs.writeFile(filepath, commonjs[key], 'utf8', done);
          });
        }, function(err) {
          if (err) { return callback(err); }
          var files = ['README.md', 'LICENSE', 'CONTRIBUTING.md', 'CHANGELOG.md', 'AUTHORS', 'core/famous.css'];
          copyFilesFromFamousRepo(version, files, destination, callback);
        });
      });
    }
  });
}

/**
 * Uses browserify to convert the CommonJS version of Famo.us to a single
 * JavaScript object that attaches itself to the `window` object as the property
 * `famous`.
 *
 * @param  {[type]}   version     [description]
 * @param  {[type]}   destination [description]
 * @param  {Function} callback    [description]
 * @return {[type]}               [description]
 */
function writeStandalone (version, destination, minify, callback) {
  if (typeof minify === 'function') {
    callback = minify;
    minify = false;
  }
  var tempDir = path.join(os.tmpdir(), [version, Date.now()].join('-'));
  writeCommonJS(version, tempDir, function(err) {
    if (err) { return callback(err); }
    var b = browserify(path.join(tempDir, 'index.js'), {
      standalone: 'famous'
    });
    b.bundle(function(err, src) {
      if (err) { return callback(err); }
      if (minify) {
        var result = UglifyJS.minify(src, {fromString: true});
        src = licenseHeader + result.code;
      }
      destination = path.extname(destination) === '.js' ? destination : destination + '.js';
      fs.writeFile(destination, src, 'utf8', callback);
    });
  });
}

function writeRequireJS (version, destination, minify, callback) {
  if (typeof minify === 'function') {
    callback = minify;
    minify = false;
  }
  clone({
    repo: famousGithubRepoURL,
    ref: version
  }, function(err, famousPath) {
    if (err) { return callback(err); }
    var modules = [];
    var namespace = 'famous';
    var finder = findit(famousPath);
    finder.on('directory', function (dir, stat, stop) {
        var base = path.basename(dir);
        if (base === '.git' || base === 'node_modules' || base === 'dist' || base === 'examples') {
          stop();
        }
    });
    finder.on('file', function(file) {
        if (path.extname(file) === '.js') {
            var base = path.basename(file, '.js');
            if (base === 'Gruntfile') { return; }
            var relativePath = path.relative(famousPath, path.dirname(file));
            var module = path.join(namespace, relativePath, base);
            modules.push(module);
        }
    });
    finder.on('end', function() {
        modules.sort();
        var config = {
            baseUrl: famousPath,
            paths: {
              'famous': ''
            },
            out: destination,
            include: modules,
            findNestedDependencies: true,
            optimize: 'none',
            wrap: false,
            normalizeDirDefines: 'all'
        };
        if (minify) {
            config.out = destination;
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
        requirejs.optimize(config, function() {
          callback();
        });
    });
  });
}


function writeFamousCSS (version, destination, minify, callback) {
  if (typeof minify === 'function') {
    callback = minify;
    minify = false;
  }
  clone({
    repo: famousGithubRepoURL,
    ref: version
  }, function(err, famousPath) {
    if (err) { return callback(err); }
    var cssPath = path.join(famousPath, 'core', 'famous.css');
    if (!fs.existsSync(cssPath)) {
      cssPath = path.join(famousPath, 'src', 'core', 'famous.css');
    }
    fs.readFile(cssPath, 'utf8', function(err, css) {
      if (err) { return callback(err); }
      if (minify) {
        css = licenseHeader + (new CleanCSS()).minify(css);
      }
      fs.writeFile(destination, css, 'utf8', callback);
    });
  });
}

exports.fetchFamous = fetchFamous;
exports.convert = convert;
exports.writeCommonJS = writeCommonJS;
exports.writeStandalone = writeStandalone;
exports.writeRequireJS = writeRequireJS;
exports.writeFamousCSS = writeFamousCSS;
