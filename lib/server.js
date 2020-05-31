/* Happy Coding!
—————————————————————————————————————————————————————————
file:			lib/server.js
version: 		0.0.1
last_changes:	.
—————————————————————————————————————————————————————————
*/
const bs = require('browser-sync').create()

/* Customs */
const config = require('./config.js')

module.exports.start = (cb) => {
	bs.init({
		watch: true,
		server: config.outputPath,
		serveStatic: [config.outputPath],
		serveStaticOptions: {
			extensions: ['html'] // force pretty urls
		}
	})

	cb()
}
	
module.exports.reload = bs.reload
module.exports.stream = bs.stream