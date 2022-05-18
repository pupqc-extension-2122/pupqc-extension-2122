const { src, dest, watch, series } = require('gulp');
const sourcemaps = require('gulp-sourcemaps');
const terser = require('gulp-terser');
const concat = require('gulp-concat');

const BUILD_PATH = './static/build/';
const DIST_PATH = './static/dist/';

function mainJS() {
  return src([

    // Constants
    BUILD_PATH + 'js/main/constants.js',

    // Functions
    BUILD_PATH + 'js/main/functions.js',

    // Initializations
    BUILD_PATH + 'js/main/init.js',
  ])
    .pipe(sourcemaps.init())
    .pipe(terser())
    .pipe(concat('main.js'))
    .pipe(sourcemaps.write('./jsmaps'))
    .pipe(dest(DIST_PATH + 'js/'))
}

function authJS() {
  return src(BUILD_PATH + 'js/auth/**/*.js')
    .pipe(sourcemaps.init())
    .pipe(terser())
    .pipe(sourcemaps.write('../jsmaps/'))
    .pipe(dest(DIST_PATH + 'js/auth/'))
}

function usersJS() {
  return src(BUILD_PATH + 'js/users/**/*.js')
    .pipe(sourcemaps.init())
    .pipe(terser())
    .pipe(sourcemaps.write('../jsmaps/'))
    .pipe(dest(DIST_PATH + 'js/users/'))
}

function watchTask() {
  watch(BUILD_PATH + 'js/**/*.js', series(mainJS, authJS, usersJS));
}

exports.watch = series(mainJS, authJS, usersJS, watchTask);