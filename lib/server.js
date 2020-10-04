/* Happy Coding!.⋆✦
—————————————————————————————————————————————————————————
file:			lib/server.js
version: 		0.0.1
last_changes:	.
—————————————————————————————————————————————————————————
*/
const bs = require('browser-sync').create()

/* Customs */
const config = require('./config')

module.exports = {
	start: (cb) => {
		return bs.init({
			watch: true,
			server: config.outputPath,
			serveStatic: [config.outputPath],
			serveStaticOptions: {
				extensions: ['html'] // force pretty urls
			}
		})
	},
	reload: bs.reload,
	stream: bs.stream
}
	
