var gulp = require('gulp');
var jscs = require('gulp-jscs');

gulp.task('default', function() {
    return gulp.src('client/app/*.js')
        .pipe(jscs());
});

/*
gulp.task('build', function() {
    gulp.src(['app.js', 'client/'])
        .pipe(gulp.dest('dist'));
});
*/
