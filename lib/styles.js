/* Happy Coding!.⋆✦
—————————————————————————————————————————————————————————
file:			lib/styles.js
version: 		0.0.1
last_changes:	.
—————————————————————————————————————————————————————————
*/

// Gulp
const {src,dest} = require('gulp')
const gulpif = require('gulp-if')
const rename = require('gulp-rename')
const concat = require('gulp-concat')
const chmod = require('gulp-chmod')
const sass = require('gulp-sass')

// Customs
const config = require('./config')
const {stream} = require('./server')
const {logf} = require('./logs')

module.exports = function buildStyles (cb) {
	return src([
		`${config.rootPath}/${config.src}/slugs/**/*+(${config.typeStyle})`,
		`${config.rootPath}/${config.src}/styles/**/*+(${config.typeStyle})`, // ext force to read files only
		`!${config.rootPath}/${config.src}/**/_*/`,
		`!${config.rootPath}/${config.src}/**/_*/**`
	])
	.pipe(logf('Building style'))
	.pipe(sass({
			outputStyle: config.debug ? 'nested' : 'compressed' // compress css files
		})
		.on('error', sass.logError))
	.pipe(concat('styles.css'))
	.pipe(chmod(0644))
	.pipe(dest(`${config.outputPath}/${config.assets}`))
	.pipe(stream())
}