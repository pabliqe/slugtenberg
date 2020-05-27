/* Happy Coding!
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
const config = require('./config.js')
const parser = require('./parser.js')
const {logfile, logany, logbreak} = require('./logs.js')

/* ——————————————————— FUNCTIONS —————————————————————— */

function handleFileName(fs) {

	// Index files works better on parent folder (cleanUrls)
	if(fs.dirname != '.')
		fs.dirname = parser.safe(fs.dirname);

	return fs;
}

/* ——————————————————— INITIALIZER —————————————————————— */

module.exports = (cb) => {
	src([
			'src/media/**/*',
			'src/slugs/**/*+(' + config.typeMedia + ')',
			'!src/**/_*/',
			'!src/**/_*/**'
		])
		.pipe(logfile('Building asset'))
		.pipe(chmod(0644))
		.pipe(rename((f) => handleFileName(f)))
		.pipe(dest(config.outputPath + '/assets'))
	
	cb()
}