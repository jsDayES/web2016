'use strict';

var gulp = require('gulp');
var path = require('path');
var fs = require('fs');
var $ = require('gulp-load-plugins')();
var runSequence = require('run-sequence');
var webserver = require('gulp-webserver');
var del = require('del');

var paths = {
  html: './*.html',
  css: './css/**/*.css',
  js: './js/**/*.js',
  images: './img/**/*',
  dist: './dist/'
};

gulp.task('clean', function (cb) {
  del([
    'dist/**',
  ], cb);
});

gulp.task('images', function () {
  return gulp.src(paths.images)
    .pipe($.imagemin({ progressive: true }))
    .pipe(gulp.dest(paths.dist + '/images/'));
});

gulp.task('js', function () {
  return gulp.src(paths.js)
    .pipe($.concat('app-main.js'))
    .pipe($.uglify())
    .pipe(gulp.dest(paths.dist + '/js/'));
});

gulp.task('css', function () {
  return gulp.src(paths.css)
    .pipe($.concat('main.css'))
    .pipe($.cssmin())
    .pipe(gulp.dest(paths.dist + '/css/'));
});

gulp.task('build', function () {
  return gulp.src(paths.html)
    .pipe($.useref())
    .pipe($.if('*.js', $.uglify()))
    .pipe($.if('*.css', $.cssmin()))
    .pipe(gulp.dest(paths.dist));
});

gulp.task('html', function () {
  return gulp.src(paths.html)
    .pipe($.minifyHtml())
    .pipe(gulp.dest(paths.dist));
});

gulp.task('server', function () {
  gulp.src('.')
    .pipe(webserver({
      port: 5000,
      livereload: false,
      directoryListing: {
        enable: false,
      },
      open: 'index.html'
    }));
});

gulp.task('build', function () {
  runSequence('clean', 'images', 'concats', 'copy');
})