var gulp = require('gulp'),
	postcss = require('gulp-postcss'),
	precss = require('precss'),
	colorRgbaFallback = require('postcss-color-rgba-fallback'),
	opacity = require('postcss-opacity'),
	pseudoelements = require('postcss-pseudoelements'),
	cleanCSS = require('gulp-clean-css'),
	postcssPresetEnv = require('postcss-preset-env'),
	px2rem = require('postcss-px2rem'),
	del = require('del'),
	runSequence = require('run-sequence'),
	cssBase64 = require('gulp-css-base64'),
	gulpWebpack = require("webpack-stream"),
	webpackConf = require('./build/webpack.conf'),
	vinylNamed = require('vinyl-named'),
	rev = require('gulp-rev'),
	revCollector = require('gulp-rev-collector');

var sass = require('gulp-sass');
sass.compiler = require('node-sass');

var watchCssList = ['client/css/*.scss'],
    watchScriptList = ['client/js/*.js'],
    watchImage = ['client/images/*'],
	buildEnterCssList = ['client/css/home.scss'],
	cleanStaticList = ['app/public'];

//压缩css
var postcssPlugins = [
	postcssPresetEnv({
		autoprefixer: {
			browsers: 'last 6 versions',
			cascade: false
		}
	}),
	px2rem({
		remUnit: 75
	}),
	precss,
	colorRgbaFallback,
	opacity,
	pseudoelements
];
gulp.task('cssmin', function() {
	return gulp.src(buildEnterCssList)
		.pipe(sass().on('error', sass.logError))
		// .pipe(cssBase64({
		// 	extensionsAllowed: ['.gif', '.jpg', '.png', '.jpeg']
		// }))
		.pipe(postcss(postcssPlugins))
		.pipe(cleanCSS({
			advanced: true, //类型：Boolean 默认：true [是否开启高级优化（合并选择器等）]
			compatibility: 'ie8', //类型：String 默认：''or'*' [启用兼容模式； 'ie7'：IE7兼容模式，'ie8'：IE8兼容模式，'*'：IE9+兼容模式]
			keepBreaks: false //类型：Boolean 默认：false [是否保留换行]
		}))
		.pipe(rev())
		.pipe(gulp.dest('app/public/css'))
		.pipe(rev.manifest())
		.pipe(gulp.dest('rev/css'));
});
gulp.task('cssminDev', function() {
	return gulp.src(buildEnterCssList)
		.pipe(sass().on('error', sass.logError))
		.pipe(cssBase64({
			extensionsAllowed: ['.gif', '.jpg', '.png', '.jpeg']
		}))
		.pipe(postcss(postcssPlugins))
		.pipe(cleanCSS({
			advanced: true, //类型：Boolean 默认：true [是否开启高级优化（合并选择器等）]
			compatibility: 'ie8', //类型：String 默认：''or'*' [启用兼容模式； 'ie7'：IE7兼容模式，'ie8'：IE8兼容模式，'*'：IE9+兼容模式]
			keepBreaks: false //类型：Boolean 默认：false [是否保留换行]
		}))
		.pipe(gulp.dest('rev/debug/css'));
});

// 压缩js
gulp.task('scriptmin', function() {
	return gulp.src(Object.values(webpackConf.entry))
		.pipe(vinylNamed())
		.pipe(gulpWebpack(webpackConf))
		.pipe(rev())
		.pipe(gulp.dest('app/public/js'))
		.pipe(rev.manifest())
		.pipe(gulp.dest('rev/js'));
});
gulp.task('scriptminDev', function() {
	return gulp.src(Object.values(webpackConf.entry))
		.pipe(vinylNamed())
		.pipe(gulpWebpack(webpackConf))
		.pipe(gulp.dest('rev/debug/js'))
});

// 修改模板
gulp.task('revStatic', function() {
	return gulp.src(['rev/**/*.json', 'app/view/*.nj'])
		.pipe(revCollector({
			replaceReved: true,
			dirReplacements: {
				'/public/css': '/public/css',
				'/public/js': '/public/js'
			}
		}))
		.pipe(gulp.dest('app/view'));
});

// 图片拷贝
gulp.task('copyImage', function () {
    return gulp.src('client/images/*')
        .pipe(gulp.dest('app/public/images'));
});

// 开发模式
gulp.task('dev', function(cb) {
	gulp.watch(watchCssList, function(event) {
		runSequence('cssminDev');
	});
	gulp.watch(watchScriptList, function(event) {
		runSequence('scriptminDev');
    });
	gulp.watch(watchImage, function (event) {
	    runSequence('copyImage');
	});
});

// 清除静态资源目录
gulp.task('cleanStatic', function(cb) {
	return del(cleanStaticList, cb);
});

// build
gulp.task('default', ['cleanStatic'], function() {
	runSequence(['scriptmin', 'cssmin', 'copyImage'], 'revStatic');
});