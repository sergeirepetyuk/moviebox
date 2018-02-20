var gulp = require('gulp');
var fs = require("fs");
var {promisify} = require("util");
const readFile = promisify(fs.readFile);
var browserSync = require('browser-sync').create();

gulp.task('default', ['less', "mustache","copy","server"], function () {
    gulp.watch('./src/style/**/*.less', ['less']);
    gulp.watch('./src/img/*.*', ['copy']);
    gulp.watch([
        './src/data/data.json',
        './src/**/*.html'
    ], ['mustache']);
});


var less = require('gulp-less');
var path = require('path');

gulp.task('less', function () {
    return gulp.src('./src/style/**/*.less')
        .pipe(less({
            paths: [path.join(__dirname, 'less', 'includes')]
        }))
        .pipe(gulp.dest('./docs/style'));
});

var mustache = require("gulp-mustache");
gulp.task("mustache", async () => {
    const data = JSON.parse(await readFile("./src/data/data.json", "utf-8"));

    return gulp.src("./src/**/*.html")
        .pipe(mustache(data))
        .pipe(gulp.dest("./docs"));
})

gulp.task('copy', function () {
    gulp.src("./src/img/*.*")
        .pipe(gulp.dest('./docs/img/'));
});


gulp.task('server', function(){
    browserSync.init({
        server:{
            baseDir: "docs/"
        },
        files: ['docs/*.html','docs/*.css','docs/img/*.*']
    });
});
