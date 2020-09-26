/* Happy Coding!
—————————————————————————————————————————————————————————
file:			lib/watch.js
version: 		0.0.1
last_changes:	.
—————————————————————————————————————————————————————————
*/
const {watch, series} = require('gulp')

// Customs
const config = require('./config.js')

/* ——————————————————— INITIALIZER —————————————————————— */

module.exports = () => {

	// Watch for any file used in views
	watch([
        `${config.src}/data/**/*`,
        `${config.src}/slugs/**/*`,
        `${config.src}/media/**/*`,
        `${config.src}/includes/**/*`,
        `${config.src}/layouts/**/*`
    ], series('build:views'))

    // Watch for styles
    watch([
        `${config.src}/slugs/**/*+(${config.typeStyle})`,
        `${config.src}/styles/**/*+(${config.typeStyle})`
    ], series('build:styles'))

    // Watch for scripts
    watch([
        `${config.src}/slugs/**/*+(${config.typeScript})`,
        `${config.src}/scripts/**/*+(${config.typeScript})`
    ], series('build:scripts'))

    // Watch for media files in any location
    watch([
        `${config.src}/slugs/**/*+(${config.typeMedia})`,
        `${config.src}/media/**/*+(${config.typeMedia})`
    ], series('build:media'))
}