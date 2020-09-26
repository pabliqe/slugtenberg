/* Happy Coding!
—————————————————————————————————————————————————————————
file:			gulpfile.js
version: 		0.0.1
last_changes:	.
—————————————————————————————————————————————————————————
*/
const {task,series} = require('gulp')
const config = require('./lib/config')
const server = require('./lib/server')
const styles = require('./lib/styles')
const scripts = require('./lib/scripts')
const media = require('./lib/media')
const views = require('./lib/views')
const parser = require('./lib/parser')
const watch = require('./lib/watch')

/* ————————————————— INTIIALIZERS —————————————————— */

task('server:start', server.start);
task('server:reload', server.reload);

task('build:views', views);
task('build:styles', styles);
task('build:scripts', scripts);
task('build:media', media);

task('clean', parser.clean);

task('build', series(
	'build:views',
	'build:styles',
	'build:scripts',
	'build:media'
))

task('watch', watch)