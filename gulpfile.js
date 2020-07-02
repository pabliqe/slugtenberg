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

task('watch', lib.watch)