/* Happy Coding!
—————————————————————————————————————————————————————————
file:			lib/views.js
version: 		0.0.1
last_changes:	.
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
const config = require('./config.js')
const parser = require('./parser.js')
const {logfile, logany, logbreak} = require('./logs.js')

var ENGINE_OPTS = {
	engine: {
		globals: {
			config: config
		},
		cache: config.viewCache,
		root: config.viewRoots,
		strictFilters: config.strictFilters,
		strictVariables: config.strictVariables,
		extname: String(config.typeTemplate).split('|')[0]
	},
	filters: {

		// Slug
		slugLink: (a) => config.baseUrl + '/' + a,
		assetLink: (a) => config.cdnUrl + '/assets/' + a,
		makeSlug: (a) => parser.make(a),
		unmakeSlug: (a) => parser.unmake(a),
		safeSlug: (a) => parser.safe(a),

		// Counters
		max: (a,b) => (a > b) ? b : a,
		min: (a,b) => (!a) ? a : (a < b) ? b : a,

		// Arrays
		randomize: (a) => shuffleArray(a),
		randomFirst: (a) => a[Math.floor(Math.random(a.length))],
		whereNot: (a,b,c) => a.filter((v,i) => !(b in v) || (c && v[b] !== c)),
		whereLess: (a,b,c) => a.filter((v,i) => (b in v) && v[b] <= c),
		whereGreater: (a,b,c) => a.filter((v,i) => (b in v) && v[b] >= c),

		// Others
		or: (a, b, c) => a ? a : (b ? b : (c ? c : ''))
	}
}

/* ——————————————————— HELPERS —————————————————————— */

function walkObj(obj, condition, action) {

	Object.entries(obj).forEach((v,i,a) => {
		if(typeof obj[v[0]] == "object")
			walkObj(obj[v[0]], condition, action)
			
		else if(condition(v[0], obj))
			action(obj[v[0]], obj)
	})
}

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

function handleSlugs(pipe) {
	let s = parser.safe(pipe)

	logbreak('Extending $1', [s])
	
	switch(typeof pipe) {
		
		// Parsing direct slug from path
		case 'string':

			pipe = extend({
				current: s
			},
			
			parser.load(s))

		// Parse object for slug
		case 'object':
			
			walkObj(pipe,
				
				// [CONDITION] Match key slug
				(k, o) => (k == 'slug'),

				// [ACTION] Append slug data
				(v, o) => {
					extend(o, parser.load(v))
				}
			)

		logany('Data loaded for ' + s, pipe)

		return pipe;
	}
}

function handleFileName(fs) {

	// Index files works better on parent folder (cleanUrls)
	if(fs.basename == 'index' && fs.dirname != '.') {

		return {
			dirname: fs.dirname.replace(parser.parent(fs.dirname), ''),
			basename: parser.safe(fs.dirname),
			extname: fs.extname
		}

	// Regular views are just some html
	} else {
		return {
			dirname: fs.dirname,
			basename: parser.safe(fs.dirname + '/' + fs.basename + fs.extname),
			extname: '.html'
		}
	}
}

function handleDatasheets(filepath, globals) {
	logbreak('Loading data from $1', [filepath])

	// Basic datasheet options
	let options = {
		name: parser.safe(filepath)
	}

	// Search for datasheet configuration files
	let optionsLoaded = parser.search(path.dirname(filepath), new RegExp(options.name + '(' + config.typeData + ')$'))
	extend(options, optionsLoaded);

	logany('Configuration for ' + options.name, options);

	// Save global data extracted from sheet
	let loaded = parser.read(filepath, {
		columns: (header) => {
			return header.map((h) => parser.make(h))
		},
		cast: (value, context) => {
			if('columns' in options && context.header in options.columns) {
				if(!value)
					value = ''

				else if(options.columns[context.header].type == 'array')
					value = String(value).split(',')
			}
			
			return value
		}
	})

	logany('Data loaded from ' + options.name, loaded.length + ' ' + typeof loaded + 's')

	// If 'use_layout' output views from datasheet
	if(options.use_layout) {
		loaded.forEach((v,i,a) => {
			v.slug = parser.make((i + 1) + '-' + v[options.column_slug]);

			src('src/layouts/' + options.use_layout + '+(' + config.typeTemplate + ')')
				.pipe(logfile('Building view@data', options.name + '/' + v.slug))
				.pipe(data((f) => handleSlugs(v)))
				.pipe(liquid(ENGINE_OPTS))
				.pipe(rename((f) => handleFileName(v.slug)))
				// Group generated files on one folder
				.pipe(dest(config.outputPath + '/' + options.name))
		})
	}

	// Save to global object
	globals[options.name] = loaded;
}

function handleDataSlugs(filepath, globals) {
	
	logbreak('Loading data from $1', filepath)
	
	let loaded = parser.search(filepath)
	let s = parser.safe(filepath)
	
	logany('Data loaded for' + s, Object.keys(loaded).length + ' ' + typeof loaded + 's')

	// Save to global object
	globals[s] = loaded;
}

/* ——————————————————— INITIALIZER —————————————————————— */

module.exports = (cb) => {
	
	// Append global data files
	let dir = 'src/data';
	if(fs.existsSync(dir)) {
		fs.readdirSync(dir)
			.filter((v) => typeof v == 'string' && v[0] !== '.' )
			.forEach((v,i,a) => {
				if(v.match(new RegExp('(' + config.typeDataSheet + ')$')))
					handleDatasheets(dir + '/' + v, ENGINE_OPTS.engine.globals)

				else if(fs.lstatSync(dir + '/' + v).isDirectory())
					handleDataSlugs(dir + '/' + v, ENGINE_OPTS.engine.globals)
			})
	}

	src([
			'src/slugs/**/*+(' + config.typeTemplate + ')',  // Ext force to read files only
			'!src/**/_*/',
			'!src/**/_*/**'
		])
		.pipe(logfile('Building view'))
		.pipe(data((f) => handleSlugs(f.path)))
		.pipe(liquid(ENGINE_OPTS))
		.pipe(rename((f) => handleFileName(f)))
		.pipe(dest(config.outputPath))

	cb()
}