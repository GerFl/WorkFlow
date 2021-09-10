const { src, dest, watch } = require('gulp');
const gulpSass = require('gulp-sass');
const dartSass = require('dart-sass');
const sass = gulpSass(dartSass);
const uglify = require('gulp-uglify');

function compilarSass() {
    return src('./src/scss/app.scss')
        .pipe(sass())
        .pipe(sass({ outputStyle: 'compressed' }))
        .pipe(dest('./public/css'));
}

function minificarJs() {
    return src('./src/js/app.js')
        .pipe(uglify())
        .pipe(dest('./public/js'));
}

function uatu() {
    watch('./src/scss/*.scss', compilarSass);
    // watch('./src/js/*.js', minificarJs);
}

exports.compilarSass = compilarSass;
exports.uatu = uatu;

/*
    --- Minificar imagenes ---
    npm install --save-dev gulp-imagemin
    npm install --save-dev gulp-notify
    npm install --save-dev gulp-webp
    npm install --save-dev autoprefixer
    npm install --save-dev postcss
    npm install --save-dev gulp-postcss
    npm install --save-dev gulp-sourcemaps
    npm install --save-dev cssnano
    const { src, dest, watch, series, parallel } = require('gulp');
    const notify=require('gulp-notify');
    const imagemin=require('gulp-imagemin');
    const webp=require('gulp-webp');
    // Utilidades CSS
    const autoprefixer=require('autoprefixer');
    const postcss=require('gulp-postcss');
    const cssnano=require('cssnano');
    const sourcemaps=require('gulp-sourcemaps');
    // Utilidades JS
    npm install --save-dev gulp-terser-js
    const terser=require('gulp-terser-js');
    const rename=require('gulp-rename');

    function minimizarImagenes(){
        return src('src/img/**')
            .pipe(sourcemaps.init())
            .pipe(imagemin())
            .pipe(postcss(autoprefixer(),cssnano()))
            .pipe(sourcemaps.write('.'));
            .pipe(dest('./public/assets))
            .pipe(notify({message:'Imagen minificada'}))
    }
    function formatoWebp(){
    return src('src/img/**')
        .pipe(webp())
        .pipe(dest('./public/assets))
        .pipe(notify({message:'Imagen convertida'}))
    }

    function minimizarJS(){
        return src(path.js)
            .pipe(concat('bundle.js'))
            .pipe(sourcemaps.init())
            .pipe(terser())
            .pipe(sourcemaps.write('.'))
            .pipe(rename({surfix:'.min'}))
            .pipe(dest('./))
    }

    exports.minimizarimagenes
    exports.formatoWebp
    exports.default=series(compilarSass,minimizarImagenes, webp, uatu);
    
    const paths:{
        imagenes:'src/img/**'
    }
    return src(paths.imagenes)
*/