const gulp = require('gulp');
const babel = require('gulp-babel');
const sass = require('gulp-sass');
const jade = require('gulp-jade');
const copy = require('gulp-copy');
const merge = require('merge-stream');

gulp.task('styles', function() {
  gulp.src(['styles/pages/*.scss'])
    .pipe(sass())
    .pipe(gulp.dest('public/styles/pages'));

  gulp.src(['styles/themes/*.scss'])
    .pipe(sass())
    .pipe(gulp.dest('public/styles/themes'));
})

gulp.task('scripts-es6', function() {
  return gulp.src(['scripts/**/*.js', '!scripts/boot.js'])
    .pipe(babel({
      presets: ['es2015'],
      plugins: ["transform-es2015-modules-amd"]
    }))
    .pipe(gulp.dest('public/scripts'))
});

gulp.task('scripts', function() {
  return gulp.src('scripts/boot.js')
    .pipe(gulp.dest('public/scripts'))
});


gulp.task('views', function() {
  gulp.src('views/pages/*.jade')
    .pipe(jade({ pretty: true }))
    .pipe(gulp.dest('public/'));

  gulp.src('views/widgets/*.jade')
    .pipe(jade({ pretty: true }))
    .pipe(gulp.dest('public/widgets'));
});

gulp.task('components', function() {
  return gulp.src('components/**/*')
    .pipe(copy('public/'));
});

gulp.task('watch', function() {
  gulp.watch('styles/**/*.scss', function(event) {
    gulp.run('styles');
  });

  gulp.watch('scripts/**/*.js', function(event) {
    gulp.run('scripts', 'scripts-es6');
  });

  gulp.watch('views/**/*.jade', function(event) {
    gulp.run('views');
  });

  gulp.watch('components/**/*', function(event) {
    gulp.run('components');
  });
});

gulp.task('default', ['styles', 'scripts', 'scripts-es6', 'views', 'components']);
