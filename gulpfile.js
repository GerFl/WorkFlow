const { src, dest } = require('gulp');
const gulpSass = require('gulp-sass');
const dartSass = require('dart-sass');
const sass = gulpSass(dartSass);

function compilarSass() {
    return src('./src/scss/estilos.scss')
        .pipe(sass())
        .pipe(dest('./public/css'));
}

exports.compilarSass = compilarSass;