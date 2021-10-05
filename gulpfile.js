const { src, dest, watch } = require('gulp');
const gulpSass = require('gulp-sass');
const dartSass = require('dart-sass');
const sass = gulpSass(dartSass);

function compilarSass() {
    return src('./src/scss/app.scss')
        .pipe(sass())
        .pipe(sass({ outputStyle: 'compressed' }))
        .pipe(dest('./public/css'));
}

function uatu() {
    watch('./src/scss/*.scss', compilarSass);
}

exports.compilarSass = compilarSass;
exports.uatu = uatu;