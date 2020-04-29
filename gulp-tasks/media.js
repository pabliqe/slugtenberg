const log = require('fancy-log')

/* Gulp */
const {src,dest} = require('gulp')
const rename = require('gulp-rename')
const chmod = require('gulp-chmod')
const merge = require('merge-stream')

/* Customs */
const config = require('./config.js')

module.exports = () => {
	return merge(
			src([
				'src/static/**/*',
				'!src/**/_*/',
				'!src/**/_*/**/*'
			]),
			src([
				'src/slugs/**/*+(' + config.typeMedia + ')',
				'!src/**/_*/',
				'!src/**/_*/**/*'
			])
		)
		.pipe(rename((f) => log('Moving media: ', f.dirname + '/' + f.basename)))
		.pipe(chmod(0644))
		.pipe(dest(config.outputPath + '/assets'))
	
}