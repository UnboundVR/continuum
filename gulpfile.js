'use strict';

var watchify = require('watchify');
var browserify = require('browserify');
var gulp = require('gulp');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var gutil = require('gulp-util');
var sourcemaps = require('gulp-sourcemaps');
var assign = require('lodash.assign');
var strictify = require('strictify');
var stringify = require('stringify');
var browserifyShim = require('browserify-shim');
var jscs = require('gulp-jscs');
var uglify = require('gulp-uglify');
var del = require('del');

gulp.task('jscs', function() {
    return gulp.src(['client/main.js', 'client/app/**/*.js', 'db/populate.js', 'server/**/*.js'])
      .pipe(jscs({fix: true}))
      .pipe(jscs.reporter())
      .pipe(gulp.dest(function(file) {
        return file.base;
      }));
});

gulp.task('clean', function() {
    return del(['build/metavrse.js', 'build/metavrse.js.map'])
});

var customOpts = {
  entries: ['./client/main.js'],
  debug: false
};
var opts = assign({}, watchify.args, customOpts);
var b = watchify(browserify(opts));

b.transform(stringify({
  extensions: ['.html', '.css'],
  minify: true,
  minifier: {
    extensions: ['.html', '.css'],
  }
}));

b.transform(strictify);

gulp.task('js', ['clean'], bundle); // so you can run `gulp js` to build the file
b.on('update', bundle); // on any dep update, runs the bundler
b.on('log', gutil.log); // output build logs to terminal

function bundle() {
  return b.bundle()
    // log errors if they happen
    .on('error', gutil.log.bind(gutil, 'Browserify Error'))
    .pipe(source('metavrse.js'))
    // optional, remove if you don't need to buffer file contents
    .pipe(buffer())
    // optional, remove if you dont want sourcemaps
    .pipe(sourcemaps.init({loadMaps: true})) // loads map from browserify file
    // Add transformation tasks to the pipeline here.
    .pipe(uglify())
    .pipe(sourcemaps.write('./')) // writes .map file
    .pipe(gulp.dest('./build'));
}
