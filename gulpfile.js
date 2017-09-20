var gulp = require('gulp'),
    sass = require('gulp-sass'),
    jshint = require('gulp-jshint'),
    prettify = require('gulp-jsbeautifier'),
    uglify = require('gulp-uglify'),
    include = require('gulp-include'),
    header = require('gulp-header'),
    rename = require('gulp-rename'),
    sourcemaps = require('gulp-sourcemaps'),
    gutil = require('gulp-util');

// Path Configuration
var paths = {
    sass: {
        source: './src/scss/sux-admin.scss',
        watch: './src/scss/**/*.scss',
        dest: './dist/css'
    },
    script: {
        source: './src/scripts/sux-admin.js',
        watch: './src/scripts/**/*.js',
        dest: './dist/js'
    }
};

// Configuration
var config = {
    prettify: {
        indent_size: 4
    }
};

// using data from package.json
var pkg = require('./package.json');
var banner = ['/*!',
  ' * <%= pkg.name %> - <%= pkg.description %>',
  ' * @version v<%= pkg.version %>',
  ' * @link <%= pkg.homepage %>',
  ' * @license <%= pkg.license %>',
  ' */',
  ''].join('\n');

// Sass file tasks
gulp.task('sass:expanded', function() {
    gulp.src(paths.sass.source)
        .pipe(header(banner, {pkg:pkg}))
        .pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
        .pipe(gulp.dest(paths.sass.dest));
});

gulp.task('sass:compressed', function() {
    gulp.src(paths.sass.source)
        .pipe(sourcemaps.init())
        .pipe(header(banner, {pkg:pkg}))
        .pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
        .pipe(rename({extname: '.min.css'}))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(paths.sass.dest));
});

// Js file tasks
gulp.task('js:prettify', function() {
    gulp.src(paths.script.source)
        .pipe(include())
        .pipe(header(banner, {pkg:pkg}))
        .pipe(prettify(config.prettify))
        .pipe(gulp.dest(paths.script.dest));
});

gulp.task('js:uglify', function() {
    gulp.src(paths.script.source)
        .pipe(sourcemaps.init())
        .pipe(include())
        .pipe(header(banner, {pkg:pkg}))
        .pipe(uglify().on('error', gutil.log))
        .pipe(rename({extname: '.min.js'}))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(paths.script.dest));
});

gulp.task('js:hint', function() {
    gulp.src(paths.script.watch)
        .pipe(jshint());
});

// Wrap tasks into sub module
gulp.task('sass', ['sass:expanded', 'sass:compressed']);
gulp.task('js', ['js:prettify', 'js:uglify']);

// Watch tasks
gulp.task('watch', ['sass', 'js', 'js:hint'], function() {
    gulp.watch(paths.sass.watch, ['sass']);
    gulp.watch(paths.script.watch, ['js', 'js:hint']);
});

// Default task for travis-ci
gulp.task('default', ['sass', 'js']);
