var gulp = require('gulp');
var rename = require("gulp-rename");
var minifyCSS = require('gulp-minify-css');
var uglify = require('gulp-uglify');
var imagemin = require('gulp-imagemin');
var pngquant = require('imagemin-pngquant');
var jpegtran = require('imagemin-jpegtran');
var copy = require('gulp-copy');
var removeHtmlComments = require('gulp-remove-html-comments');
 

gulp.task('copy-fonts', function() {
    gulp.src('./fonts/*')
       .pipe(gulp.dest('../Publicado/fonts/'));
});

gulp.task('copy-icon', function() {
    gulp.src('./icon.png')
       .pipe(gulp.dest('../Publicado/'));
});

gulp.task('copy-html', function() {
    gulp.src('./index.html')
        .pipe(removeHtmlComments())
        .pipe(gulp.dest('../Publicado/'));
});

gulp.task('copy-sons', function() {
    gulp.src('./sons/*')
       .pipe(gulp.dest('../Publicado/sons/'));
});

gulp.task('copy-js', function() {
    gulp.src('./js/*.js')
        .pipe(uglify())
        .pipe(rename({
            dirname: "/",
            suffix: ''
        }))
        .pipe(gulp.dest('../Publicado/js/'));
});

gulp.task('image', function () {
    return gulp.src('./imgs/*.*')
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant(),jpegtran()]
        }))
        .pipe(gulp.dest('../Publicado/imgs/'));
});

gulp.task('copy-css', function () {
    gulp.src('./css/*.css')
        .pipe(minifyCSS())
        .pipe(gulp.dest('../Publicado/css/'));
});

gulp.task('publicar', ['copy-css','copy-fonts','image','copy-js','copy-html', 'copy-sons','copy-icon']);
