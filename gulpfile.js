'use strict';

// Require
var gulp         = require('gulp'),
    plugins      = require('gulp-load-plugins')({
        pattern: ['gulp-*', 'gulp.*', 'main-*'],
        replaceString: /\bgulp[\-.]/        
    });

// Paths
var paths = {
    'dev': {
        'less'   : './src/less/',
        'js'     : './src/js/',
        'vendor' : './src/vendor/',
        'images' : './src/img/',
        'fonts'  : './src/fonts/'
    },
    'production': {
        'css'    : './assets/css/',
        'js'     : './assets/js/',
        'fonts'  : './assets/fonts/',
        'images' : './assets/img/'
    }
};

// VENDOR

gulp.task('vendor-fonts', function() {
    return gulp.src([
        'bower_components/font-awesome/fonts/fontawesome-webfont.*',
        'bower_components/Ionicons/fonts/ionicons.*'
    ])
    .pipe(gulp.dest(paths.production.fonts));
});

gulp.task('vendor-js', function(){
    return gulp.src(plugins.mainBowerFiles('**/*.js'))
    .pipe(plugins.concat('vendor.min.js'))
    .pipe(plugins.uglify())
    .pipe(gulp.dest(paths.production.js));
});

gulp.task('vendor-css', function(){
    return gulp.src(plugins.mainBowerFiles('**/*.{css,less}'))
    .pipe(plugins.less())
    .pipe(plugins.concat('vendor.min.css'))
    .pipe(plugins.cleanCss({keepSpecialComments:0}))
    .pipe(gulp.dest(paths.production.css));
});

// AUTHOR

gulp.task('css', function() {
    return gulp.src([paths.dev.less+'*.{css,less}','!'+paths.dev.less+'helpers.less'])
    .pipe(plugins.plumber())
    .pipe(plugins.less())
    .pipe(plugins.autoprefixer(
        'last 2 version',
        '> 1%',
        'safari 5',
        'ie 8',
        'ie 9',
        'opera 12.1',
        'ios 6',
        'android 4' ) )
    .pipe(plugins.cleanCss({keepSpecialComments:0}))
    .pipe(plugins.rename({suffix: '.min'}))
    .pipe(plugins.concat('author.min.css'))
    .pipe(gulp.dest(paths.production.css))
    .pipe(plugins.notify("CSS compilation successful!"));
});

gulp.task('js', function(){  
    return gulp.src(paths.dev.js+'author.js')
    .pipe(plugins.concat('author.min.js'))
    .pipe(plugins.uglify())
    .pipe(gulp.dest(paths.production.js))
    .pipe(plugins.notify("JS compilation successful!"));
});

gulp.task('images', function() {
    return gulp.src(paths.dev.images+'**/*.{png,jpg,gif}')
    .pipe(plugins.imagemin({ progressive: true }))
    .pipe(gulp.dest(paths.production.images))
    .pipe(plugins.notify( { message: 'Images task complete', onLast: true } ));
});

gulp.task('fonts', function() {
    return gulp.src(paths.dev.fonts+'**/*.{woff,woff2}')
    .pipe(gulp.dest(paths.production.fonts))
    .pipe(plugins.notify('Fonts task complete'));
});

gulp.task('default', ['vendor-fonts','vendor-js','vendor-css','css','js','images','fonts'], function () {
    gulp.watch('src/less/*.less', ['css']);
    gulp.watch('src/js/author.js', ['js']);
    gulp.watch('src/img/*.{png,jpg,gif}', ['images']);
});
