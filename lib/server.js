const bs = require('browser-sync').create()

/* Customs */
const config = require('../lib/config.js')

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
	bs.reload()

	cb()
}