'use strict';

var gulp = require('gulp');
var babelify = require('babelify');
var uglify = require('gulp-uglify');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var sourcemaps = require('gulp-sourcemaps');
var gutil = require('gulp-util');
var browserSync = require('browser-sync').create();

var paths = {
    files: ['LICENSE', 'README.md', 'index.html'],
    mainScript: 'main.js',
    scripts: ['main.js', 'src/**/*.js'],
};

gulp.task('copy:files', function() {
    return gulp.src(paths.files)
        .pipe(gulp.dest('out'));
});

gulp.task('build:js', function() {
    return browserify({
            entries: paths.mainScript,
            debug: true
        })
        .transform(babelify)
        .bundle()
        .pipe(source(paths.mainScript))
        .pipe(buffer())
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(uglify())
        .on('error', gutil.log)
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('out'));
});

gulp.task('browser-sync', ['default'], function() {
    browserSync.init({
        server: {
            baseDir: "out"
        }
    });
});

gulp.task('watch', ['default'], function() {
    gulp.watch(paths.files, ['copy:files']).on('change', browserSync.reload);
    gulp.watch(paths.scripts, ['build:js']).on('change', browserSync.reload);
});

gulp.task('default', ['build:js', 'copy:files']);
