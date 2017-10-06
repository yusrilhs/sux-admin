var gulp = require('gulp'),
    sass = require('gulp-sass'),
    jshint = require('gulp-jshint'),
    prettify = require('gulp-jsbeautifier'),
    uglify = require('gulp-uglify'),
    include = require('gulp-include'),
    header = require('gulp-header'),
    rename = require('gulp-rename'),
    sourcemaps = require('gulp-sourcemaps'),
    gutil = require('gulp-util')
    concat = require('gulp-concat'),
    autoprefixer = require('gulp-autoprefixer');

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
    },
    vendor: {
        css: {
            source: [
                './node_modules/bootstrap/dist/css/bootstrap.min.css',
                './node_modules/font-awesome/css/font-awesome.min.css',
                './node_modules/animate.css/animate.min.css',
                './node_modules/jquery.scrollbar/jquery.scrollbar.css'
            ],
            dest: './dist/css'
        },
        js: {
            source: [
                './node_modules/jquery/dist/jquery.min.js',
                './node_modules/bootstrap/dist/js/bootstrap.min.js',
                './node_modules/jquery.scrollbar/jquery.scrollbar.min.js',
                './node_modules/headroom.js/dist/headroom.min.js',
                './node_modules/headroom.js/dist/jQuery.headroom.min.js'
            ],
            dest: './dist/js'
        },
        fonts: {
            source: [
                './node_modules/font-awesome/fonts/*'
            ],
            dest: './dist/fonts'
        }
    },
    plugins: {
        sass: {
            source: './src/plugins/**/*.scss',
            dest: './dist/plugins'
        },
        script: {
            source: './src/plugins/**/*.js',
            dest: './dist/plugins'
        }
    },
    dist: {
        css: './dist/css/**/*',
        js: './dist/js/**/*',
        fonts: './dist/fonts/**/*',
        plugins: {
            css: [
                './dist/plugins/**/*.css',
                './dist/plugins/**/*.css.map'
            ],
            js: [
                './dist/plugins/**/*.js',
                './dist/plugins/**/*.js.map'
            ]
        }
    },
    docs: {
        assets: {
            css: './docs/assets/css',
            js: './docs/assets/js',
            fonts: './docs/assets/fonts',
            plugins: './docs/assets/plugins'
        }
    }
};

// Configuration
var config = {
    prettify: {
        indent_size: 4
    },
    autoprefixer: {
        browsers: [
            'ie >= 10',
            'last 2 versions'
        ]
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
        .pipe(autoprefixer(config.autoprefixer))
        .pipe(gulp.dest(paths.sass.dest));
});

gulp.task('sass:compressed', function() {
    gulp.src(paths.sass.source)
        .pipe(sourcemaps.init())
        .pipe(header(banner, {pkg:pkg}))
        .pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
        .pipe(rename({extname: '.min.css'}))
        .pipe(autoprefixer(config.autoprefixer))
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

// Vendor file tasks
gulp.task('vendor:css', function() {
    gulp.src(paths.vendor.css.source)
        .pipe(concat('vendor.css'))
        .pipe(gulp.dest(paths.vendor.css.dest));
});

gulp.task('vendor:js', function() {
    gulp.src(paths.vendor.js.source)
        .pipe(concat('vendor.js'))
        .pipe(gulp.dest(paths.vendor.js.dest));
});

gulp.task('vendor:fonts', function() {
    gulp.src(paths.vendor.fonts.source)
        .pipe(gulp.dest(paths.vendor.fonts.dest));
});

// Plugins file tasks
gulp.task('plugins:sass:expanded', function() {
    gulp.src(paths.plugins.sass.source)
        .pipe(header(banner, {pkg:pkg}))
        .pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
        .pipe(autoprefixer(config.autoprefixer))
        .pipe(gulp.dest(paths.plugins.sass.dest));
});

gulp.task('plugins:sass:compressed', function() {
    gulp.src(paths.plugins.sass.source)
        .pipe(sourcemaps.init())
        .pipe(header(banner, {pkg:pkg}))
        .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
        .pipe(rename({extname: '.min.css'}))
        .pipe(autoprefixer(config.autoprefixer))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(paths.plugins.sass.dest));
});

gulp.task('plugins:js:prettify', function() {
    gulp.src(paths.plugins.script.source)
        .pipe(header(banner, {pkg:pkg}))
        .pipe(prettify(config.prettify))
        .pipe(gulp.dest(paths.plugins.script.dest));
});

gulp.task('plugins:js:uglify', function() {
    gulp.src(paths.plugins.script.source)
        .pipe(sourcemaps.init())
        .pipe(include())
        .pipe(header(banner, {pkg:pkg}))
        .pipe(uglify().on('error', gutil.log))
        .pipe(rename({extname: '.min.js'}))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(paths.plugins.script.dest));
});

// Wrap tasks into sub module
gulp.task('sass', ['sass:expanded', 'sass:compressed'], function() {
    gulp.src(paths.dist.css)
        .pipe(gulp.dest(paths.docs.assets.css));
});

gulp.task('js', ['js:prettify', 'js:uglify'], function() {
    gulp.src(paths.dist.js)
        .pipe(gulp.dest(paths.docs.assets.js));
});
gulp.task('vendor', ['vendor:css', 'vendor:js','vendor:fonts'], function() {
    gulp.src(paths.dist.fonts)
        .pipe(gulp.dest(paths.docs.assets.fonts));
});

gulp.task('plugins:sass', ['plugins:sass:expanded', 'plugins:sass:compressed'], function() {
    gulp.src(paths.dist.plugins.css)
        .pipe(gulp.dest(paths.docs.assets.plugins));
});

gulp.task('plugins:js', ['plugins:js:prettify', 'plugins:js:uglify'], function() {
    gulp.src(paths.dist.plugins.js)
        .pipe(gulp.dest(paths.docs.assets.plugins));
});

// Build tasks
gulp.task('build', ['sass', 'js', 'plugins:js', 'plugins:sass' ,'vendor']);

// Watch tasks
gulp.task('watch', ['build'], function() {
    gulp.watch(paths.sass.watch, ['sass']);
    gulp.watch(paths.script.watch, ['js', 'js:hint']);
    gulp.watch(paths.plugins.sass.source, ['plugins:sass']);
    gulp.watch(paths.plugins.script.source, ['plugins:js']);
});

// Default task for travis-ci
gulp.task('default', ['build']);
