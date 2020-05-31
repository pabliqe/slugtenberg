/* Happy Coding!
—————————————————————————————————————————————————————————
file:			gulpfile.js
version: 		0.0.1
last_changes:	.
—————————————————————————————————————————————————————————
*/
const {task,watch,series} = require('gulp')
const lib = require('require-dir')('./lib')

/* ————————————————— INTIIALIZERS —————————————————— */

task('server:start', lib.server.start);
task('server:reload', lib.server.reload);

task('build:views', lib.views);
task('build:styles', lib.styles);
task('build:scripts', lib.scripts);
task('build:media', lib.media);

task('clean', lib.parser.clean);

task('build', series(
	'build:views',
	'build:styles',
	'build:scripts',
	'build:media'
))

task('watch', () => {

	// Watch for any file used in views
	watch([
			'src/data/**/*',
			'src/slugs/**/*',
			'src/media/**/*',
			'src/includes/**/*',
			'src/layouts/**/*'
		],
		series('build:views'))
	
	// Watch for styles
	watch([
			'src/slugs/**/*+(' + lib.config.typeStyle + ')',
			'src/styles/**/*+(' + lib.config.typeStyle + ')'
		],
		series('build:styles'))
	
	// Watch for scripts
	watch([
			'src/slugs/**/*+(' + lib.config.typeScript + ')',
			'src/scripts/**/*+(' + lib.config.typeScript + ')'
		],
		series('build:scripts'))
	
	// Watch for media files in any location
	watch([
			'src/slugs/**/*+(' + lib.config.typeMedia + ')',
			'src/media/**/*+(' + lib.config.typeMedia + ')'
		],
		series('build:media'))
})