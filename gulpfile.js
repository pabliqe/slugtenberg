const {task,watch,series} = require('gulp')
const tasks = require('require-dir')('./tasks')
const config = require('./lib/config');

/* —————————————— MODULAR TASK INCLUDER —————————————— */


function init(obj, parent) {

	Object.entries(obj).forEach((v,i,a) => {
		let k = v[0]
		let f = v[1]

		if(typeof f == 'function') {
			let n = parent ? parent + ':' + k : k;
			task(n, obj[k])

		} else if(typeof f == 'object') {
			init(f, k)
		}
	})
}

init(tasks);

/* ————————————————— INTIIALIZERS —————————————————— */

task('build', series(
	'views',
	'styles',
	'scripts',
	'media',
	'server:reload'
))

task('watch', () => {

	// Watch for any file used in views
	watch([
		'src/data/**/*+(' + config.typeData + ')',
		'src/includes/**/*+(' + config.typeTemplate + ')',
		'src/layouts/**/*+(' + config.typeTemplate + ')',
		'src/slugs/**/*+(' + config.typeTemplate + '|' + config.typeData + ')'],
		series('views', 'server:reload'))
	
	// Watch for styles
	watch('src/styles/**/*+(' + config.typeStyle + ')',
		series('styles', 'server:reload'))
	
	// Watch for scripts
	watch('src/scripts/**/*+(' + config.typeScript + ')',
		series('scripts', 'server:reload'))
	
	// Watch for media files in any location
	watch([
		'src/slugs/**/*+(' + config.typeMedia + ')',
		'src/media/**/*+(' + config.typeMedia + ')'],
		series('media', 'server:reload'))
})