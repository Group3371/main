'use strict';

var gulp = require('gulp'),
    concat = require('gulp-concat'),
    scss = require('gulp-sass'),
    uglify = require('gulp-uglify'),
    minifyCss = require('gulp-minify-css'),
    autoPrefixer = require('gulp-autoprefixer'),
    ngAnnotate = require('gulp-ng-annotate'),
    browserSync = require('browser-sync'),
    reload      = browserSync.reload,
    templateCache = require('gulp-angular-templatecache');

// Задача для сбора js файлов. Создается файл app.js и libs.js ( в него будет склеены все библиотеки)
gulp.task('js',function(){
    //gulp.src([
    //    'bower_components/jquery/dist/jquery.js',
    //    'bower_components/angular/angular.js',
    //    'bower_components/angular-ui-router/release/angular-ui-router.js',
    //    //'bower_components/angular-bootstrap/ui-bootstrap.js',
    //    'bower_components/angular-bootstrap/ui-bootstrap-tpls.js',
    //    'bower_components/angular-aria/angular-aria.js',
    //    'bower_components/angular-animate/angular-animate.js',
    //    'bower_components/angular-material/angular-material.js',
    //    'bower_components/firebase/firebase.js',
    //    'bower_components/angularfire/dist/angularfire.js',
    //    'bower_components/moment/moment.js',
    //    'bower_components/mdPickers/dist/mdPickers.js',
    //    'bower_components/angular-youtube-mb/src/angular-youtube-embed.js',
    //    'bower_components/ngInfiniteScroll/build/ng-infinite-scroll.js'
    //])
    //.pipe(concat('libs.js'))
    //.pipe(gulp.dest('builds/dev'));

    gulp.src([
        'builds/dev/app/**/*.js',
        '!builds/dev/app/**/*_test.js'
    ])
    .pipe(concat('app.js'))
    .pipe(ngAnnotate())
    .pipe(gulp.dest('builds/dev'))
    .pipe(reload({stream: true}));
});

// Задача для сборки проекта на продакшн.
gulp.task('pjs',function(){
    gulp.src([
        'bower_components/angular/angular.min.js',
        'bower_components/angular-ui-router/release/angular-ui-router.min.js',
        'bower_components/angular-bootstrap/ui-bootstrap.min.js',
        'bower_components/angular-bootstrap/ui-bootstrap-tpls.min.js'
    ])
    .pipe(concat('libs.js'))
    .pipe(gulp.dest('builds/prod'));

    gulp.src([
        'builds/dev/app/**/*.js',
        '!builds/dev/app/**/*_test.js'
    ])
    .pipe(concat('app.js'))
    .pipe(ngAnnotate())
    .pipe(uglify())
    .pipe(gulp.dest('builds/prod'))
    .pipe(reload({stream: true}));
});

// Задача по сборуу css фалов для рабочей версии
gulp.task('css',function(){
    gulp.src([
        'bower_components/bootstrap/dist/css/bootstrap.css',
        'bower_components/bootstrap/dist/css/bootstrap-status.css',
        'bower_components/angular-bootstrap/ui-bootstrap-csp.css',
        'bower_components/angular/angular-csp.css',
        'bower_components/angular-material/angular-material.css',
        'bower_components/mdPickers/dist/mdPickers.css'
    ])
    .pipe(concat('theme.css'))
    .pipe(gulp.dest('builds/dev'));

    gulp.src('builds/dev/app/**/*.scss')
    .pipe(scss())
    //.pipe(autoPrefixer())
    .pipe(concat('app.css'))
    //.pipe(minifyCss())
    .pipe(gulp.dest('builds/dev'))
    .pipe(reload({stream: true}));
});

// Сбор css файлов на продакшн
gulp.task('pcss',function(){
    gulp.src([
        'bower_components/bootstrap/dist/css/bootstrap.min.css',
        'bower_components/bootstrap/dist/css/bootstrap-status.min.css',
        'bower_components/angular-bootstrap/ui-bootstrap-csp.css',
        'bower_components/angular/angular-csp.css'
    ])
    .pipe(concat('theme.css'))
    .pipe(gulp.dest('builds/prod'));


    gulp.src('builds/dev/app/**/*.css')
    .pipe(scss())
    .pipe(autoPrefixer())
    .pipe(concat('app.css'))
    .pipe(minifyCss())
    .pipe(gulp.dest('builds/prod'))
    .pipe(reload({stream: true}));
});

gulp.task('webserver',function(){
    browserSync({
        server: { baseDir: "./builds/dev/" }
    });

    gulp.watch('builds/dev/**/*.js',['js']);
    gulp.watch('builds/dev/**/*.scss',['css']);
    gulp.watch('builds/dev/app/templates/*.html',['templateCache']);
});

gulp.task('pwebserver',function(){
    browserSync({
        server: { baseDir: "./builds/prod/" }
    });

    gulp.watch('builds/dev/**/*.html',['phtml']);
    gulp.watch('builds/dev/**/*.js',['pjs']);
    gulp.watch('builds/dev/**/*.scss',['pcss']);
});

gulp.task('phtml',function(){
    gulp.src('builds/dev/**/*.html')
        .pipe(gulp.dest('builds/prod'));
});

gulp.task('default',[
    'js',
    'css',
    'webserver'
]);

gulp.task('production',[
    'pjs',
    'pcss',
    'phtml',
    'pwebserver'
]);

// Сборка шаблонов и сохранение их в $templateCaсhe
gulp.task('templateCache', function () {
    return gulp.src('builds/dev/app/templates/**/*.html')
        .pipe(templateCache('templates.js',{
            templateHeader: ';(function () { angular.module("<%= module %>"<%= standalone %>, []).run(["$templateCache", function($templateCache) {',
            templateFooter: '}]); })();'
        }))
        .pipe(gulp.dest('builds/dev/app/templatesScripts/'));
});