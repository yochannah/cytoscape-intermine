var gulp = require('gulp'),
    connect = require('gulp-connect'),
    browserify = require('browserify'),
    sourcemaps = require('gulp-sourcemaps'),
    gutil = require('gulp-util'),
    source = require('vinyl-source-stream'),
    buffer = require('vinyl-buffer'),
    mocha = require('mocha'),
    uglify = require('gulp-uglify'),
    watchify = require('watchify');

/**
 * loads a server at the specified port
 */

gulp.task('connect', function () {
  connect.server({
    port: 8888
  });
});

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
 * Bundles JS up using browserify fort
 */


var b = watchify(browserify({
    entries: './entry.js',
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

gulp.task('default', [
  'connect',
//  'watch-mocha',
  'js'
]);
