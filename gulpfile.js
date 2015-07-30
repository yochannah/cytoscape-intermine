var gulp        = require('gulp'),
    less        = require('gulp-less'),
    browserify  = require('browserify'),
    sourcemaps  = require('gulp-sourcemaps'),
    gutil       = require('gulp-util'),
    source      = require('vinyl-source-stream'),
    buffer      = require('vinyl-buffer'),
    mocha       = require('mocha'),
    uglify      = require('gulp-uglify'),
    watchify    = require('watchify'),
    browserSync = require('browser-sync').create();

/**
* runs tests in the specified folder
*/
gulp.task('mocha', function() {
    return gulp.src(['test/*.js'], { read: false })
        .pipe(mocha({ reporter: 'list' }))
        .on('error', gutil.log);
});

/**
 * watches test files and re-runs the tests if the files change
 */
gulp.task('watch-mocha', function() {
    gulp.watch(['js/**', 'test/**'], ['mocha']);
});

/**
 * Bundles and uglifys the JS
 */
var b = watchify(browserify({
  debug: true
  }));
gulp.task('js', bundle);

function bundle() {
  return b.bundle()
    // log errors if they happen
    .on('error', gutil.log.bind(gutil, 'Browserify Error'))
    .pipe(source('js/main.js'))
    // optional, remove if you don't need to buffer file contents
    .pipe(buffer())
    // optional, remove if you dont want sourcemaps
    .pipe(sourcemaps.init({loadMaps: true})) // loads map from browserify file
    // Add transformation tasks to the pipeline here.
    .pipe(uglify()).on('error', gutil.log)
    .pipe(sourcemaps.write('./')) // writes .map file
    //uglify
    .pipe(gulp.dest('./../dist/bundle.js'));
}

// create a task that ensures the `js` task is complete before
// reloading browsers
gulp.task('js-watch', ['js'], browserSync.reload);

gulp.task('serve', ['less', 'js'], function() {

    browserSync.init({
        server: "./"
    });

    gulp.watch("./less/**/*.less", ['less']);
    gulp.watch("./js/*.js", ['js-watch']);
    gulp.watch("./*.html").on('change', browserSync.reload);
});

/*
Compiles less but excludes partials starting with underscore, e.g. _loader.less
 */
gulp.task('less', function() {
  return gulp.src(['./less/**/*.less', '!./less/**/_*'])
      .pipe(less('style.less'))
      .pipe(gulp.dest('./dist'))
      .pipe(browserSync.stream());
});


gulp.task('default', [
//  'connect',
//  'watch-mocha',
  'serve',
  'js'
]);
