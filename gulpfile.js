'use strict';

var watchify = require('watchify');
var browserify = require('browserify');
var strictify = require('strictify');
var stringify = require('stringify');

var gulp = require('gulp');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var gutil = require('gulp-util');
var sourcemaps = require('gulp-sourcemaps');
var assign = require('lodash.assign');
var jscs = require('gulp-jscs');
var uglify = require('gulp-uglify');
var del = require('del');

var jasmine = require('gulp-jasmine');

gulp.task('test', function () {
  return gulp.src('spec/**/*.js')
    .pipe(jasmine({
      verbose: true
    }));
});

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
var b = browserify(opts);

b.transform(stringify({
  extensions: ['.html', '.css'],
  minify: true,
  minifier: {
    extensions: ['.html', '.css'],
  }
}));

b.transform(strictify);
b.on('log', gutil.log);

gulp.task('js', ['clean'], function() {
    var bundle = function() {
        return w.bundle()
          .on('error', gutil.log.bind(gutil, 'Browserify Error'))
          .pipe(source('metavrse.js'))
          .pipe(buffer())
          .pipe(sourcemaps.init({loadMaps: true}))
          .pipe(sourcemaps.write('./'))
          .pipe(gulp.dest('./build'));
    }

    var w = watchify(b);
    w.on('update', bundle);
    return bundle();
});

gulp.task('default', ['test', 'clean'], function() {
    return b.bundle()
      .on('error', gutil.log.bind(gutil, 'Browserify Error'))
      .pipe(source('metavrse.js'))
      .pipe(buffer())
      .pipe(sourcemaps.init({loadMaps: true}))
      .pipe(uglify())
      .pipe(sourcemaps.write('./'))
      .pipe(gulp.dest('./build'));
});
