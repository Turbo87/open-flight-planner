var gulp = require('gulp');
var babel = require('gulp-babel');

gulp.task('copy:files', function() {
    return gulp.src(['LICENSE', 'README.md', 'index.html'])
        .pipe(gulp.dest('out'));
});

gulp.task('build:js', function() {
    return gulp.src('main.js')
        .pipe(babel())
        .pipe(gulp.dest('out'));
});

gulp.task('default', ['build:js', 'copy:files']);
