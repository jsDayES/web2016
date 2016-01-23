'use strict';

var gulp = require('gulp');
var path = require('path');
var fs = require('fs');
var $ = require('gulp-load-plugins')();
var runSequence = require('run-sequence');
var webserver = require('gulp-webserver');
var debug = require('gulp-debug');
var del = require('del');

var paths = {
  html: './*.html',
  fonts: './font-awesome/fonts/*.*',
  css: './css/**/*.css',
  js: './js/**/*.js',
  images: './img/**/*',
  dist: './dist/'
};

gulp.task('clean', function () {
  return del([
    './dist/**',
  ]);
});

gulp.task('images', function () {
  return gulp.src(paths.images)
    .pipe($.imagemin({ progressive: true }))
    .pipe(gulp.dest(paths.dist + '/images/'));
});

gulp.task('js', function () {
  return gulp.src(paths.js)
    .pipe($.concat('main.js'))
    .pipe($.uglify())
    .pipe(gulp.dest(paths.dist + '/js/'));
});

gulp.task('css', function () {
  return gulp.src(paths.css)
    .pipe($.concat('main.css'))
    .pipe($.cssmin())
    .pipe(gulp.dest(paths.dist + '/css/'));
});

gulp.task('fonts', function () {
  return gulp.src(paths.fonts)
    .pipe(gulp.dest(paths.dist + '/css/fonts'));
});

gulp.task('copy', function () {
  return gulp.src('./**/*.css')
    .pipe(gulp.dest(paths.dist + '/css'));
});

gulp.task('build', ['images', 'fonts', 'js', 'css'], function () {
  return gulp.src('index.html')
    .pipe($.useref())
    .pipe($.minifyHtml({
      quotes: true,
      empty: true,
      spare: true
    }))
    .pipe(gulp.dest('dist'))
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

gulp.task('server:dist', ['dist'], function () {
  gulp.src('.')
    .pipe(webserver({
      port: 5000,
      livereload: false,
      directoryListing: {
        enable: false,
      },
      open: 'dist/index.html'
    }));
});

gulp.task('dist', function (cb) {
  runSequence('clean', 'build', cb);
})