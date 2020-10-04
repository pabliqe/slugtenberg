/* Happy Coding!.⋆✦
—————————————————————————————————————————————————————————
file:			lib/scripts.js
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
const babel = require('gulp-babel')
const uglify = require('gulp-uglify')
const jshint = require('gulp-jshint')

// Customs
const config = require('./config')
const {logf} = require('./logs')

module.exports = function buildScripts(cb) {
	return src([
		`${config.rootPath}/${config.src}/slugs/**/*+(${config.typeScript})`,
		`${config.rootPath}/${config.src}/scripts/**/*+(${config.typeScript})`, // ext force to read files only
		`!${config.rootPath}/${config.src}/**/_*/`,
		`!${config.rootPath}/${config.src}/**/_*/**`
	])
	.pipe(logf('Building script'))
	.pipe(concat('scripts.js'))
	.pipe(jshint())
	.pipe(jshint.reporter('default'))
	.pipe(babel({
		presets: ['@babel/env']
	}))
	.pipe(gulpif(config.debug, uglify())) // compress js output
	.pipe(chmod(0644))
	.pipe(dest(`${config.outputPath}/${config.assets}`))
}