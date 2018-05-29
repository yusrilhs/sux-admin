const gulp = require('gulp')
    , pump = require('pump')
    , merge = require('merge-stream')
    , browserSync = require('browser-sync').create()
    , batch = require('gulp-batch')
    , watch = require('gulp-watch')
    , rename = require('gulp-rename')
    , header = require('gulp-header')
    , autoprefixer = require('gulp-autoprefixer')
    , uglify = require('gulp-uglify')
    , sourcemaps = require('gulp-sourcemaps')
    , sass = require('gulp-sass')

const config = {
  banner: `/*!
 * Sux Admin - Bootstrap 4 admin theme
 *
 * @version   2.0.0
 * @author    Yusril Herlian Syah <yusrilhsyah@gmail.com>
 * @license   MIT
 */`,
  autoprefixer: {
    browsers: ['last 2 version', 'IE >= 10']
  },
  browserSync: {
    server: {
      baseDir: './demo'
    },
    notify: false
  },
  vendors: {
    'materialdesignicons': './node_modules/@mdi/font/**/*',
    'bootstrap': './node_modules/bootstrap/dist/**/*',
    'jquery': './node_modules/jquery/dist/**/*',
    'popper.js': './node_modules/popper.js/dist/umd/**/*'
  }
}

gulp.task('sass:expanded', (cb) => {
  pump([
    gulp.src('./src/stylesheets/sux-admin.scss'),
    sass({outputStyle: 'expanded'}),
    header(config.banner),
    autoprefixer(config.autoprefixer),
    gulp.dest('./dist/css'),
    gulp.dest('./demo/css')
  ], cb)
})

gulp.task('sass:compressed', (cb) => {
  pump([
    gulp.src('./src/stylesheets/sux-admin.scss'),
    sourcemaps.init(),
    sass({outputStyle: 'compressed'}),
    header(config.banner),
    autoprefixer(config.autoprefixer),
    rename({extname: '.min.css'}),
    sourcemaps.write('.'),
    gulp.dest('./dist/css'),
    gulp.dest('./demo/css')
  ], cb)
})

gulp.task('sass:bootstrap', (cb) => {
  pump([
    gulp.src('./src/stylesheets/sux-admin.bootstrap.scss'),
    sass({outputStyle: 'compressed'}),
    autoprefixer(config.autoprefixer),
    rename({extname: '.min.css'}),
    gulp.dest('./dist/css'),
    gulp.dest('./demo/css')
  ], cb)
})

gulp.task('script:default', (cb) => {
  pump([
    gulp.src('./src/scripts/**/*.js'),
    header(config.banner),
    gulp.dest('./dist/js'),
    gulp.dest('./demo/js')
  ], cb)
})

gulp.task('script:uglify', (cb) => {
  pump([
    gulp.src('./src/scripts/**/*.js'),
    sourcemaps.init(),
    uglify(),
    header(config.banner),
    rename({extname: '.min.js'}),
    sourcemaps.write('.'),
    gulp.dest('./dist/js'),
    gulp.dest('./demo/js')
  ], cb)
})

gulp.task('vendor', () => {
  Object.keys(config.vendors).map(dir => {
    return gulp.src(config.vendors[dir])
              .pipe(gulp.dest(`./dist/vendor/${dir}`))
              .pipe(gulp.dest(`./demo/vendor/${dir}`))
  })
})

gulp.task('sass', ['sass:expanded', 'sass:compressed', 'sass:bootstrap'])
gulp.task('script', ['script:default', 'script:uglify'])

gulp.task('watch:sass', () => {
  watch('./src/stylesheets/**/*.scss', batch((evt, done) => {
    gulp.start('sass', () => {
      browserSync.reload()
      done()
    })
  }))
})

gulp.task('watch:script', () => {
  watch('./src/scripts/**/*.js', batch((evt, done) => {
    gulp.start('script', () => {
      browserSync.reload()
      done()
    })
  }))
})

gulp.task('watch:demo', () => {
  watch('./demo/**/*', batch((evt, done) => {
    browserSync.reload()
    done()
  }))
})

gulp.task('watch', ['default'], () => {
  browserSync.init(config.browserSync)
  gulp.start('watch:sass')
  gulp.start('watch:script')
  gulp.start('watch:demo')
})

gulp.task('default', ['sass', 'script', 'vendor'])
