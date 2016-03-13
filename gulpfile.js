'use strict';
const gulp = require('gulp');
const uglify = require('gulp-uglify');
const babel = require('gulp-babel');
const concat = require('gulp-concat');

gulp.task('babel', function() {
	return gulp
			.src(['public/classes/Basis.js', 'public/classes/*.js'])
			.pipe(babel({presets: ['es2015']}))
			.pipe(concat('thegame.min.js'))
			.pipe(uglify())
			.pipe(gulp.dest('public/dist'));
});
//
//gulp.task('styles', function() {
//	return gulp
//			.src(['public/styles/sass/main.sass'])
//			.pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
//			.pipe(gulp.dest('public/styles/'));
//});
//gulp.start('default');

gulp.task('default', ['babel']);