const gulp = require('gulp');
const uglify = require('gulp-uglify');
const babel = require('gulp-babel');
const concat = require('gulp-concat');

gulp.task('default', () => {
	return gulp.src(['classes/Basis.js', 'classes/*.js'])
		.pipe(babel({presets: ['es2015']}))
		.pipe(concat('thegame.min.js'))
		.pipe(uglify())
		.pipe(gulp.dest('dist'));
})

gulp.start('default');