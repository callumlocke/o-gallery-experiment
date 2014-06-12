'use strict';
var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var browserify = require('browserify');


gulp.task('styles', function () {
  return gulp.src('src/main.scss')
    .pipe($.rubySass({
      loadPath: 'bower_components',
      quiet: true
    }).on('error', console.log))
    .pipe($.csso())
    .pipe(gulp.dest('stage'));
});

gulp.task('html', function () {
  return gulp.src('src/o-gallery.html')
    .pipe(gulp.dest('stage'));
});

gulp.task('scripts', function () {
  return browserify('./src/main.js')
    .transform('debowerify')
    .bundle()
    .pipe(require('vinyl-source-stream')('main.js'))
    .pipe($.buffer())
    .pipe($.uglify())
    .pipe(gulp.dest('stage'));
});


gulp.task('stage', ['styles', 'html', 'scripts']);

// gulp.task('watch', ['stage'], function () {
//   gulp.watch('src/*.scss', 'scss');
// });

gulp.task('build', ['stage'], function () {
  return gulp.src('stage/o-gallery.html')
    .pipe($.fileInsert({
      '/* STYLES */': 'stage/main.css',
      '/* SCRIPT */': 'stage/main.js'
    }))
    .pipe(gulp.dest('dist'));
});
