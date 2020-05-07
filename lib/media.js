const log = require('fancy-log')

/* Gulp */
const {src,dest} = require('gulp')
const rename = require('gulp-rename')
const chmod = require('gulp-chmod')

/* Customs */
const config = require('../lib/config.js')

module.exports = (cb) => {
	src([
			'src/static/**/*',
			'src/slugs/**/*+(' + config.typeMedia + ')',
			'!src/**/_*/',
			'!src/**/_*/**'
		])
		.pipe(rename((f) => log('Moving media: ', f.dirname + '/' + f.basename)))
		.pipe(chmod(0644))
		.pipe(dest(config.outputPath + '/assets'))
	
	cb()
}