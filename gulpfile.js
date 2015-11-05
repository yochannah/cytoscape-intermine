'use strict';

/**
 * This is the file that configures the project build!
 */

var gulp        = require('gulp'),
    less        = require('gulp-less'),
    sourcemaps  = require('gulp-sourcemaps'),
    gutil       = require('gulp-util'),
    minifyCSS   = require('gulp-minify-css'),
    uglify      = require('gulp-uglify'),
    streamify   = require('gulp-streamify'),
    watchify    = require('watchify'),
    stringify   = require('stringify'),
    browserify  = require('browserify'),
    browserSync = require('browser-sync').create(),
    source      = require('vinyl-source-stream'),
    buffer      = require('vinyl-buffer'),
    assign      = require('lodash.assign');

    //browserify options
    var customOpts = {
      entries: ['./js/main.js'],
        debug: true,
        standalone : 'cymine' //exposes the variable cymine outside the
                              //browserify scope
    };
    var opts = assign({}, watchify.args, customOpts);
    var b, i=0;

    gulp.task('js', bundleOnce); // so you can run `gulp js` to build the file just once
    gulp.task('jsdev', bundleDev); // so you can run `gulp jsdev` to build the file and reload in browser automatically

    //master bundle file
    function bundle() {
      return b
        .transform(stringify(['.html']))
        .bundle()
          //log errors if they happen
        .on('error', gutil.log.bind(gutil, 'Browserify Error'))
        .pipe(source('bundle.js'))
        .pipe(streamify(uglify({mangle:false})))
//        .pipe(streamify(uglify()))
        .pipe(gulp.dest('./dist'));
    }

    //build once. for use mostly when 'gulp' is run (default task)
    function bundleOnce() {
      b = browserify(opts);
      return bundle();
    }

    //build and reload, and keep watching for more changes
    function bundleDev(){
      b = watchify(browserify(opts));
      b.on('update', bundle); // on any dep update, runs the bundler
      b.on('log', gutil.log); // output build logs to terminal
      return bundle();
    }

/*
This is the one that makes a live server with autorefresh for all your debuggy needs.
Helper function. You probably don't want to call it directly.
 */
gulp.task('serve', ['less', 'jsdev'], function() {

    browserSync.init({
        server: "./",
        online:true,
        open:false
    });

    gulp.watch("./less/**/*.less", ['less']);
    gulp.watch("./dist/*.js").on('change', browserSync.reload);
    gulp.watch("./*.html").on('change', browserSync.reload);
});

/*
Compiles less but excludes partials starting with underscore, e.g. _loader.less
Helper function. You probably don't ever need to call it directly.
 */
gulp.task('less', function() {
  return gulp.src(['./less/**/*.less', '!./less/**/_*'])
      .pipe(less())
      .pipe(minifyCSS())
      .pipe(gulp.dest('./dist'))
      .pipe(browserSync.stream());
});

//These are the tasks most likely to be run by a user

/*
Starts server for dev use. To use in the command line run `gulp dev`
 */
gulp.task('dev', [
  'serve', //includes css
  'jsdev'
], function() {
  gutil.log(gutil.colors.yellow('| =================================================='));
  gutil.log(gutil.colors.yellow('| Congrats, it looks like everything is working!'));
  gutil.log(gutil.colors.yellow('| Browsersync is running on the ports below and will'));
  gutil.log(gutil.colors.yellow('| Live-reload your js and CSS as you work.'));
  gutil.log(gutil.colors.yellow('| ____________________________________________'));
  gutil.log(gutil.colors.yellow('|'));
  gutil.log(gutil.colors.yellow('| To run tests while working, open a new terminal and run:'));
  gutil.log(gutil.colors.yellow('| mocha --watch'));
  gutil.log(gutil.colors.yellow('| =================================================='));
});


/*
Build for prod use. Just run `gulp`, and the results will appear in the dist folder :)
 */
gulp.task('default', [
  'less',
  'js'
], function() {
  gutil.log(gutil.colors.green('| =====================|'));
  gutil.log(gutil.colors.green('|   Project built! :)  |'));
  gutil.log(gutil.colors.green('| =====================|'));
});

//todo: add error handling to the messages above?
