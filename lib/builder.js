/* Happy Coding!.⋆✦
—————————————————————————————————————————————————————————
file:			lib/watch.js
version: 		0.0.1
last_changes:	.
—————————————————————————————————————————————————————————
*/
const {watch, series} = require('gulp')

// Customs
const config = require('./config.js')
const styles = require('./styles')
const scripts = require('./scripts')
const media = require('./media')
const views = require('./views')

/* ——————————————————— INITIALIZER —————————————————————— */

module.exports = {
    all: (cb) => {
        return series(
            views,
            styles,
            scripts,
            media
        )(cb)
    },
    watch: (cb) => {

        // Watch for any file used in views
        watch([
            `${rootPath}/${config.src}/data/**/*`,
            `${rootPath}/${config.src}/slugs/**/*`,
            `${rootPath}/${config.src}/media/**/*`,
            `${rootPath}/${config.src}/includes/**/*`,
            `${rootPath}/${config.src}/layouts/**/*`
        ], series(views))

        // Watch for styles
        watch([
            `${rootPath}/${config.src}/slugs/**/*+(${config.typeStyle})`,
            `${rootPath}/${config.src}/styles/**/*+(${config.typeStyle})`
        ], series(styles))

        // Watch for scripts
        watch([
            `${rootPath}/${config.src}/slugs/**/*+(${config.typeScript})`,
            `${rootPath}/${config.src}/scripts/**/*+(${config.typeScript})`
        ], series(scripts))

        // Watch for media files in any location
        watch([
            `${rootPath}/${config.src}/slugs/**/*+(${config.typeMedia})`,
            `${rootPath}/${config.src}/media/**/*+(${config.typeMedia})`
        ], series(media))

        try {
            cb()
        } catch(e) {}
    }
}