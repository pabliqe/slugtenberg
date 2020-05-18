const log = require('fancy-log')

/* Gulp */
const {src,dest} = require('gulp')
const gulpif = require('gulp-if')
const rename = require('gulp-rename')
const concat = require('gulp-concat')
const chmod = require('gulp-chmod')
const sass = require('gulp-sass')

/* Customs */
const config = require('./config.js')

module.exports = (cb) => {
	src([
		'src/slugs/**/*+(' + config.typeStyle + ')',
		'src/styles/**/*+(' + config.typeStyle + ')', // ext force to read files only
		'!src/**/_*/',
		'!src/**/_*/**'
		])
		.pipe(rename((f) => log('Building styles: ' + f.dirname + '/' + f.basename)))
		.pipe(
			sass({
				outputStyle: config.debug ? 'nested' : 'compressed' // compress css files
			})
			.on('error', sass.logError)
		)
		.pipe(concat('styles.css'))
		.pipe(chmod(0644))
		.pipe(dest(config.outputPath + '/assets'))

	cb()
};