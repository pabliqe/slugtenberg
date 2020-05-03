const bs = require('browser-sync').create()

/* Customs */
const config = require('../lib/config.js')

module.exports.start = (done) => {
	bs.init({
		watch: true,
		server: config.outputPath,
		injectChanges: true
	})

	done()
}
	
module.exports.reload = (done) => {
	bs.reload()

	done()
}