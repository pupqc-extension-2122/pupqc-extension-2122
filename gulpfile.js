const { src, dest, watch, series } = require('gulp');
const sourcemaps = require('gulp-sourcemaps');
const terser = require('gulp-terser');
const concat = require('gulp-concat');

const BUILD_PATH = './frontend/static/build/';
const DIST_PATH = './frontend/static/dist/';

const mainJS = () => {
  return src([

    // Constants
    BUILD_PATH + 'js/main/constants.js',

    // Functions
    BUILD_PATH + 'js/main/functions.js',

    // Classes
    BUILD_PATH + 'js/main/classes.js',

    // Initializations
    BUILD_PATH + 'js/main/init.js',
  ])
    .pipe(sourcemaps.init())
    .pipe(terser())
    .pipe(concat('main.js'))
    .pipe(sourcemaps.write('./jsmaps'))
    .pipe(dest(DIST_PATH + 'js/'))
}

const authJS = () => {
  return src(BUILD_PATH + 'js/auth/**/*.js')
    .pipe(sourcemaps.init())
    .pipe(terser())
    .pipe(sourcemaps.write('../jsmaps/'))
    .pipe(dest(DIST_PATH + 'js/auth/'))
}

const modulesJS = () => {
  return src(BUILD_PATH + 'js/modules/**/*.js')
    .pipe(sourcemaps.init())
    .pipe(terser())
    .pipe(sourcemaps.write('../jsmaps/'))
    .pipe(dest(DIST_PATH + 'js/modules/'))
}

const watchTask = () => {
  watch(BUILD_PATH + 'js/**/*.js', series(mainJS, authJS, modulesJS));
}

exports.watch = series(mainJS, authJS, modulesJS, watchTask);
exports.compile_js = series(mainJS, authJS, modulesJS);