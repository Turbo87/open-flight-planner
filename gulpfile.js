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
        //.pipe(uglify())
        .on('error', gutil.log)
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('out'));
});

gulp.task('browser-sync', ['default'], function() {
    browserSync.init({
        server: {
            baseDir: "out"
        },
        files: "out/**/*.*",
        open: false,
        ghostMode: false,
        logConnections: true
    });
});

gulp.task('watch', ['default'], function() {
    gulp.watch(paths.files, ['copy:files']);
    gulp.watch(paths.scripts, ['build:js']);
});

gulp.task('serve', ['watch', 'browser-sync']);

gulp.task('default', ['build:js', 'copy:files']);
