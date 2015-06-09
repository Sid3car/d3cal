var gulp = require('gulp'),
	concat = require('gulp-concat'),
	clean = require('gulp-clean'),
	compass = require('gulp-compass'),
	minifyCSS = require('gulp-minify-css'),
	uglify = require('gulp-uglify'),
	imagemin = require('gulp-imagemin'),
	rename = require('gulp-rename'),
	src = './src/',
	dest = './dist/';


// SCRIPTS
gulp.task('clean-scripts', function() {
	return gulp.src(dest + 'scripts', {read: false})
		.pipe(clean());
});

gulp.task('scripts', ['clean-scripts'], function() {
	return gulp.src(src + 'scripts/*.js')
		.pipe(concat('index.js'))
		.pipe(gulp.dest(dest + 'scripts'));
});

gulp.task('minify-scripts', ['scripts'], function() {
	return gulp.src(dest + 'scripts/*.js')
		.pipe(uglify())
		.pipe(rename(function(path) {
			path.extname = '.min.js';
		}))
		.pipe(gulp.dest(dest + 'scripts'));
});


// STYLES
gulp.task('clean-styles', function() {
	return gulp.src(dest + 'styles', {read: false})
		.pipe(clean());
});

gulp.task('styles', ['clean-styles'], function() {
	return gulp.src(src + 'styles/*.scss')
		.pipe(compass({
			css: src + 'styles',
			sass: src + 'styles'
		}))
		.pipe(gulp.dest(dest + 'styles'));
});

gulp.task('minify-styles', ['styles'], function() {
	return gulp.src(dest + 'styles/*.css')
		.pipe(minifyCSS())
		.pipe(rename(function(path) {
			path.extname = '.min.css';
		}))
		.pipe(gulp.dest(dest + 'styles'));
});


// IMAGES
gulp.task('clean-images', function() {
	return gulp.src(dest + 'images', {read: false})
		.pipe(clean());
});

gulp.task('images', ['clean-images'], function() {
	return gulp.src(src + 'images/*.{jpg,gif,png,svg}')
		.pipe(imagemin())
		.pipe(gulp.dest(dest + 'images'));
});


// WATCH
gulp.task('watch', ['default'], function() {
	gulp.watch(src + 'styles/**/*.scss', ['styles']);
	gulp.watch(src + 'scripts/**/*.js', ['scripts']);
	gulp.watch(src + 'images/**/*.{jpg,gif,png,svg}', ['images']);
});


gulp.task('minify', ['minify-scripts', 'minify-styles']);
gulp.task('build', ['scripts', 'styles', 'images', 'minify']);
gulp.task('default', ['build']);