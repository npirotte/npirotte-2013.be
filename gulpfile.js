var argv = require('yargs').argv,
	gulp = require('gulp'),
	sourcemaps = require('gulp-sourcemaps'),
	folder = require('gulp-folders'),
	plumber = require('gulp-plumber'),
	concat = require('gulp-concat'),
	gulpif = require('gulp-if'),
	rename = require("gulp-rename"),
	watch = require('gulp-watch'),
	less = require('gulp-less'),
	path = require('path'),
	minifyCSS = require('gulp-minify-css'),
	uglify = require('gulp-uglify'),
	assetsPath = 'application/front/';

gulp.task('default', function() {
  // place code for your default task here
});

gulp.task('adminCss', function()
{
	gulp.src(assetsPath + 'admin/style_compilator.less')
		.pipe(gulpif(!argv.production, sourcemaps.init()))
		.pipe(plumber())
		.pipe(less({
	      paths: [ path.join(__dirname, 'less', 'includes') ],
	      relativeUrls : true
	    }))
	    .pipe(gulpif(argv.production, minifyCSS()))
	    .pipe(gulpif(!argv.production, sourcemaps.write()))
	    .pipe(rename('style.css'))
	    .pipe(gulp.dest(assetsPath + 'admin/dist/css/'));
});

gulp.task('adminJsModules', folder(assetsPath + 'admin/js/modules', function(folder)
{
	return gulp.src([
		path.join(assetsPath + 'admin/js/modules', folder, '*module.js'), 
		path.join(assetsPath + 'admin/js/modules', folder, '*.config.**.js'), 
		path.join(assetsPath + 'admin/js/modules', folder, '*.js')])
		.pipe(gulpif(!argv.production, sourcemaps.init()))
		.pipe(concat(folder + '.js'))
		.pipe(gulpif(argv.production, uglify({ mangle : false })))
		.pipe(gulpif(!argv.production, sourcemaps.write()))
		.pipe(gulp.dest(assetsPath + 'admin/dist/js/modules'))
}));

gulp.task('adminJsVendor', folder(assetsPath + 'admin/js/vendor', function(folder)
{
	return gulp.src([path.join(assetsPath + 'admin/js/vendor', folder, '*.js')])
		.pipe(gulpif(!argv.production, sourcemaps.init()))
		.pipe(concat(folder + '.js'))
		.pipe(gulpif(argv.production, uglify({ mangle : false })))
		.pipe(gulpif(!argv.production, sourcemaps.write()))
		.pipe(gulp.dest(assetsPath + 'admin/dist/js/vendor'))
}));