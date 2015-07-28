'use strict';

var prod = (process.env.NODE_ENV === 'production');
var out = prod ? 'out/prod' : 'out/dev';

var gulp = require('gulp');
var identity = require('gulp-identity');

var babelify = require('babelify');
var rename = require("gulp-rename");
var uglify = prod ? require('gulp-uglify') : identity;
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var sourcemaps = !prod ? require('gulp-sourcemaps') : {init: identity, write: identity};
var gutil = require('gulp-util');
var browserSync = require('browser-sync').create();

var paths = {
    files: ['LICENSE', 'index.html'],
    entry: 'main.js',
    scripts: ['main.js', 'src/**/*.js']
};

gulp.task('copy:files', function() {
    return gulp.src(paths.files)
        .pipe(gulp.dest(out));
});

gulp.task('copy:ol3', function() {
    return gulp.src(['node_modules/openlayers/dist/ol' + (prod ? '' : '-debug') + '.*'])
        .pipe(rename({basename: "ol"}))
        .pipe(gulp.dest(out));
});

gulp.task('build:js', function() {
    return browserify({
            entries: paths.entry,
            debug: !prod
        })
        .transform(babelify)
        .bundle()
        .pipe(source(paths.entry))
        .pipe(buffer())
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(uglify())
        .on('error', gutil.log)
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(out));
});

gulp.task('browser-sync', ['default'], function() {
    browserSync.init({
        server: {
            baseDir: out
        },
        files: out + "/**/*.*",
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

gulp.task('default', ['build:js', 'copy:files', 'copy:ol3']);
