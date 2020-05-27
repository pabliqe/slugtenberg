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
		server: config.outputPath,
		serveStatic: [config.outputPath],
		serveStaticOptions: {
			extensions: ['html'] // pretty urls
		}
	})

	cb()
}
	
module.exports.reload = (cb) => {
	bs.reload({stream: true})

	cb()
}