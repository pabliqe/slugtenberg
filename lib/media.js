/* Happy Coding!.⋆✦
—————————————————————————————————————————————————————————
file:			lib/media.js
version: 		0.0.1
last_changes:	.
—————————————————————————————————————————————————————————
*/

// Gulp
const {src,dest} = require('gulp')
const rename = require('gulp-rename')
const chmod = require('gulp-chmod')

// Customs
const config = require('./config')
const parser = require('./parser')
const {logf, loga, logb} = require('./logs')

function handleFileName(fs) {

	// Index files works better on parent folder (cleanUrls)
	if(fs.dirname != '.')
		fs.dirname = parser.safe(fs.dirname);

	return fs;
}

module.exports = function buildMedia(config) {
	return src([
		`${config.rootPath}/${config.src}/media/**/*`,
		`${config.rootPath}/${config.src}/data/**/*+(${config.typeMedia})`,
		`${config.rootPath}/${config.src}/slugs/**/*+(${config.typeMedia})`,
		`!${config.rootPath}/${config.src}/**/_*/`,
		`!${config.rootPath}/${config.src}/**/_*/**`
	])
	.pipe(logf('Building asset'))
	.pipe(chmod(0644))
	.pipe(rename((f) => handleFileName(f)))
	.pipe(dest(`${config.outputPath}/${config.assets}`))
}