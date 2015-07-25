var gulp = require('gulp');
var babel = require('gulp-babel');
var uglify = require('gulp-uglify');

paths = {
    files: ['LICENSE', 'README.md', 'index.html'],
    scripts: 'main.js'
};

gulp.task('copy:files', function() {
    return gulp.src(paths.files)
        .pipe(gulp.dest('out'));
});

gulp.task('build:js', function() {
    return gulp.src(paths.scripts)
        .pipe(babel())
        .pipe(uglify())
        .pipe(gulp.dest('out'));
});

gulp.task('watch', ['default'], function() {
    gulp.watch(paths.files, ['copy:files']);
    gulp.watch(paths.scripts, ['build:js']);
});

gulp.task('default', ['build:js', 'copy:files']);
