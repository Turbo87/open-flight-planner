var gulp = require('gulp');

gulp.task('default', function() {
    return gulp.src(['LICENSE', 'README.md', 'index.html', 'main.js'])
        .pipe(gulp.dest('out'));
});
