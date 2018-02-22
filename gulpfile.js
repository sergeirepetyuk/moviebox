var gulp = require('gulp');
var fs = require("fs");
var {promisify} = require("util");
const browserSync = require('browser-sync').create();
const readFile = promisify(fs.readFile);

var less = require('gulp-less');
var path = require('path');

gulp.task('less', function () {
  return gulp.src('./src/style/**/*.less')
  .pipe(less({
    paths: [ path.join(__dirname, 'less', 'includes') ]
  }))
  .pipe(gulp.dest('./docs/style'))
  .pipe(browserSync.stream());
});

var mustache = require("gulp-mustache");
gulp.task("mustache", async () => {
  const data = JSON.parse(await readFile("./src/data/data.json", "utf-8"));

  return gulp.src("./src/**/*.html")
  .pipe(mustache(data))
  .pipe(gulp.dest("./docs"));
})

gulp.task('copy', function () {
    gulp.src('./src/images/*.*')
        .pipe(gulp.dest('./docs/images/'));
});


gulp.task('default', ["less", "mustache"], function () {
    browserSync.init({
        server: "./docs"
    });

    gulp.watch('./src/style/**/*.less', ['less']);
    gulp.watch("./src/images/*.*", ["copy"]);

    gulp.watch([
        './src/data/data.json',
        './src/**/*.html'
    ], ['mustache'])
    .on('change', browserSync.reload);
});
