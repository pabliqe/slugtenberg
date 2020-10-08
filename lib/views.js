/* Happy Coding!.⋆✦
—————————————————————————————————————————————————————————
file:			lib/views.js
version: 		0.0.3
last_changes:	new imports folder
—————————————————————————————————————————————————————————
*/
const extend = require('extend')
const fs = require('fs')
const path = require('path')

// Gulp
const {src,dest} = require('gulp')
const gulpif = require('gulp-if')
const data = require('gulp-data')
const rename = require('gulp-rename')
const concat = require('gulp-concat')
const chmod = require('gulp-chmod')
const liquid = require('@tuanpham-dev/gulp-liquidjs')

// Customs
const config = require('./config')
const parser = require('./parser')
const {reload} = require('./server')
const {logf, loga, logb} = require('./logs')

var ENGINE_OPTS = {
	engine: {
		globals: {},
		cache: config.viewCache,
		root: config.viewRoots,
		strictFilters: config.strictFilters,
		strictVariables: config.strictVariables,
		//extname: String(config.typeTemplate).split('|')[0]
	},
	filters: {

		// Slug filters
		slugLink: (a) => config.baseUrl + '/' + a,
		assetLink: (a) => config.cdnUrl + '/assets/' + a,
		makeSlug: (a) => parser.make(a),
		unmakeSlug: (a) => parser.unmake(a),
		safeSlug: (a) => parser.safe(a),

		// Counter filters
		max: (a,b) => (a > b) ? b : a,
		min: (a,b) => (!a) ? a : (a < b) ? b : a,

		// Array filers
		randomize: (a) => shuffleArray(a),
		randomFirst: (a) => a[Math.floor(Math.random(a.length))],
		whereNot: (a,b,c) => a.filter((v,i) => !(b in v) || (c && v[b] !== c)),
		whereLess: (a,b,c) => a.filter((v,i) => (b in v) && v[b] <= c),
		whereGreater: (a,b,c) => a.filter((v,i) => (b in v) && v[b] >= c),

		// Other filters
		debug: (a) => JSON.stringify(a),
		or: (a, b, c) => a ? a : (b ? b : (c ? c : ''))
	}
}

/* ——————————————————— HELPERS —————————————————————— */

// http://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
function shuffleArray(array) {
	var currentIndex = array.length,
		temporaryValue,
		randomIndex
  
	// While there remain elements to shuffle...
	while (0 !== currentIndex) {
  
	  // Pick a remaining element...
	  randomIndex = Math.floor(Math.random() * currentIndex)
	  currentIndex -= 1
  
	  // And swap it with the current element.
	  temporaryValue = array[currentIndex]
	  array[currentIndex] = array[randomIndex]
	  array[randomIndex] = temporaryValue
	}
  
	return array
}

/* ——————————————————— PIPE FUNCTIONS —————————————————————— */

function handleSlugName(pipe) {
	let output = {
		dirname: parser.parents(pipe.dirname).map((v) => {
			return parser.make(v)
		}).join('/'),
		basename: parser.make(pipe.basename),
		extname: '.html'
	}

	// Index files works better on parent folder (cleanUrls)
	/*if(fs.basename == 'index' && fs.dirname != '.') {

		output = {
			dirname: fs.dirname.replace(parser.parent(fs.dirname), ''),
			basename: parser.safe(fs.dirname),
			extname: fs.extname
		}
	}*/

	loga('Output to', output.dirname + '/' + output.basename + output.extname)

	return output
}
/* ——————————————————— INITIALIZER —————————————————————— */

module.exports = (cb) => {

	Promise
		.all([
			loadImports(),
			//loadData(),
			loadSlugs()
		])
		
		.then((results) => {

			// Fix for wrapper object
			results.map((v) => {
				ENGINE_OPTS.engine.globals[Object.keys(v)[0]] = v[Object.keys(v)[0]]
			})
			
			// Save config to view
			ENGINE_OPTS.engine.globals.config = config
			
			loga('Appending data to globals:', ENGINE_OPTS.engine.globals)
			
			console.log('!!!', ENGINE_OPTS.engine.globals)

			src([
				'src/slugs/**/*+(' + config.typeTemplate + ')',  // Ext force to read files only
				'!src/**/_*/',
				'!src/**/_*/**'
			])
				.pipe(logf('Building view'))
				.pipe(data(async (f) => {
					let d = await parser.load(f.path)
					loga('Appending data to view:', d)
					return d
				}))
				.pipe(liquid(ENGINE_OPTS))
				.pipe(rename((f) => handleSlugName(f)))
				.pipe(dest(config.outputPath))
				.on('end', cb)
		})
}