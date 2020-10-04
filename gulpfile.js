/* Happy Coding!
—————————————————————————————————————————————————————————
file:			gulpfile.js
version: 		0.0.1
last_changes:	.
—————————————————————————————————————————————————————————
*/
const server = require('./lib/server')
const parser = require('./lib/parser')
const builder = require('./lib/builder')

module.exports = {
	start: server.start,
	reload: server.reload,
	clean: parser.clean,
	build: builder.all,
	watch: builder.watch
}