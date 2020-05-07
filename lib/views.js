const log = require('fancy-log')
const extend = require('extend')
const fs = require('fs')
const path = require('path')
const glob = require('glob')

/* Gulp */
const {src,dest} = require('gulp')
const gulpif = require('gulp-if')
const data = require('gulp-data')
const rename = require('gulp-rename')
const concat = require('gulp-concat')
const chmod = require('gulp-chmod')

/* Parsers */
//const csv = require('csv-parser')
const csv = require('csv-parse/lib/sync')
const liquid = require('@tuanpham-dev/gulp-liquidjs')
const md = require('markdown-it')({
	html: true,
	linkify: true,
	typographer: true
})
const yaml = require('yaml')

/* Customs */
const config = require('../lib/config.js')
const ENGINE_OPTS = {
	engine: {
		cache: config.viewCache,
		root: config.viewRoots,
		strictFilters: config.strictFilters,
		strictVariables: config.strictVariables,
		extname: String(config.typeTemplate).split('|')[0]
	},
	filters: {

		/* Slug */
		slugLink: (a) => config.baseUrl + '/' + a,
		assetLink: (a) => config.cdnUrl + '/static/' + a,
		makeSlug: (a) => makeSlug(a),
		unmakeSlug: (a) => unmakeSlug(a),
		safeSlug: (a) => safeSlug(a),

		/* Counters */
		max: (a,b) => (a > b) ? b : a,
		min: (a,b) => (!a) ? a : (a < b) ? b : a,

		/* Arrays */
		randomize: (a) => shuffleArray(a),
		randomFirst: (a) => a[Math.floor(Math.random(a.length))],
		whereNot: (a,b,c) => a.filter((v,i) => !(b in v) || (c && v[b] !== c)),
		whereLess: (a,b,c) => a.filter((v,i) => (b in v) && v[b] <= c),
		whereGreater: (a,b,c) => a.filter((v,i) => (b in v) && v[b] >= c),

		/* Others */
		or: (a, b, c) => a ? a : (b ? b : (c ? c : ''))
	}
}

var LOADED_DATA = {}

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

function getFileExt(filepath) {
	return path.extname(filepath).replace(/^\./, '')
}

function getFileName(filepath, ext) {
	return !ext ? path.basename(filepath).replace(/\.(\w+)$/, '') : path.basename(filepath)
}

function getParentName(filepath) {
	let dir = path.dirname(filepath)
	if(dir == '.')
		return '';

	return dir.replace(/^[\w\-_\/]*\//, '')
}

/* ——————————————————— SLUG FUNCTIONS —————————————————————— */

function makeSlug(str) {
	if(!str) return ''

	return String(str)
		.toLowerCase()
		.trim()
		.replace(/_/g, '--')
		.replace(/ /g, '_')
		.replace(/[^A-Za-z0-9\-\_\u00C0-\u00D6\u00D8-\u00f6\u00f8-\u00ff]/g, '')
}

function unmakeSlug(str) {
	if(!str) return ''

	return String(str)
		.replace(/_/g, ' ')
		.replace(/--/g, '_')
		.replace(/(^\w|\s\w)/g, function(char) {
			return char.toUpperCase();
		});
}

function safeSlug(filepath) {
	if(!filepath) return ''

	let slug = makeSlug(getFileName(filepath))
	let parent = getParentName(filepath)

	// try with parent folder name
	if(slug == 'index' && (parent && parent != 'slugs'))
		slug = makeSlug(parent)

	return slug
}

function handleSlug(input) {
	let output = {
		current: safeSlug(input),
		config: config,
		data: LOADED_DATA
	}

	switch(typeof input) {
		case 'object': // Parse object for slug
			output = input

			walkObj(output,
				
				// Condition: match key slug
				(k, o) => (k == 'slug'),

				// Action: append slug data
				(v, o) => {
					extend(o, {
						media: getDataBySlug(v, 'media'),
						content: getDataBySlug(v, 'content')
					}, getDataBySlug(v, 'data'))
				}
			)

			break
		
		case 'string': // Using direct slug
			input = safeSlug(input);
			
			extend(output, {
				media: getDataBySlug(input, 'media'),
				content: getDataBySlug(input, 'content')
			}, getDataBySlug(input, 'data'))

			log('Extending «' + input + '» slug', output)

			break
	}

	return output
}

function handleViewNames(file) {

	// Index files works better on parent folder (cleanUrls)
	if(file.basename == 'index' && file.dirname != '.') {

		return {
			dirname: file.dirname.replace(getParentName(file.dirname), ''),
			basename: safeSlug(getParentName(file.dirname)),
			extname: file.extname
		}

	// Regular views are just some html
	} else {
		return {
			dirname: file.dirname,
			basename: safeSlug(file.dirname + '/' + file.basename + file.extname),
			extname: '.html'
		}
	}
}

/* ——————————————————— PARSERS —————————————————————— */

function parseMarkdownFile(filepath) {
	return md.render(fs.readFileSync(filepath, "utf8"))
}

function parseDataFile(filepath, options) {
	if(!options)
		options = {}

	switch(getFileExt(filepath)) {
		case 'json':
			return JSON.parse(fs.readFileSync(filepath, 'utf-8'))
		
		case 'yml':
			return yaml.parse(fs.readFileSync(filepath, 'utf-8'))
		
		case 'csv':
			return csv(fs.readFileSync(filepath, 'utf-8'), options)
	}
}

function getDataBySlug(slug, type) {
	let output = {}

	switch (type) {
		case 'content':
			// Parse Markdown and append...
			glob.sync('src/slugs/**/' + slug + '/*+(' + config.typeContent + ')') // Matches slug childs
				.forEach((v,i,a) => {
					output[getFileName(v)] = parseMarkdownFile(v);
				})
			break
			
		case 'media':
			// Append media URL...
			glob.sync('src/slugs/**/' + slug + '/*+(' + config.typeMedia + ')') // Matches slug childs
				.forEach((v,i,a) => {
					output[getFileName(v)] = config.cdnUrl + '/assets/' + slug + '/' + getFileName(v, true)
				})
			break

		default:
		case 'data':
			// Parse JSON and append...
			glob.sync('src/slugs/**/' + slug + '+(' + config.typeData + ')') // Matches slug file
				.forEach((v,i,a) => {
					extend(output, parseDataFile(v));
				})
			break
	}

	return output
}

function parseDataSheet(filepath) {
	log('▶︎▶︎▶︎ Loading data from «' + filepath + '»')

	let fileOptions = {
		name: getFileName(filepath)
	}

	// Search for datasheet configuration files
	glob.sync(path.dirname(filepath) + '/' + fileOptions.name + '.yml')
		.forEach((v,i,a) => {
			extend(fileOptions, parseDataFile(v));
		
			log('Data config found:', fileOptions);
		});

	// Save global data extracted from sheet
	LOADED_DATA[fileOptions.name] = parseDataFile(filepath, {
		columns: (header) => {
			return header.map((h) => makeSlug(h))
		},
		cast: (value, context) => {
			if('columns' in fileOptions && context.header in fileOptions.columns) {
				if(!value)
					value = ''

				else if(fileOptions.columns[context.header].type == 'array')
					value = String(value).split(',')
			}
			
			return value
		}
	})

	log('CSV data fully loaded: ' + LOADED_DATA[fileOptions.name].length)

	// If 'use_layout' output views from datasheet
	if(fileOptions.use_layout) {
		LOADED_DATA[fileOptions.name].forEach((v,i,a) => {
			v.slug = makeSlug((i + 1) + '-' + v[fileOptions.column_slug]);

			src('src/layouts/' + fileOptions.use_layout + '+(' + config.typeTemplate + ')')
				.pipe(rename((f) => log('▶︎▶︎▶︎ Building view (@data): ' + fileOptions.name + '/' + v.slug)))
				.pipe(data((f) => handleSlug(v)))
				.pipe(liquid(ENGINE_OPTS))
				.pipe(rename((f) => handleViewNames(v.slug)))
				// Group generated files on one folder
				.pipe(dest(config.outputPath + '/' + fileOptions.name))
		})
	}
}

/* ——————————————————— INITIALIZER —————————————————————— */

module.exports = (cb) => {
	
	// Append global data files
	glob.sync('src/data/**/*+(' + config.typeDataSheet + ')')
		.forEach((v,i,a) => parseDataSheet(v))
	
	src([
			'src/slugs/**/*+(' + config.typeTemplate + ')',  // Ext force to read files only
			'!src/**/_*/',
			'!src/**/_*/**'
		])
		.pipe(rename((f) => log('▶︎▶︎▶︎ Building view: ' + f.dirname + '/' + f.basename)))
		.pipe(data((f) => handleSlug(f.path)))
		.pipe(liquid(ENGINE_OPTS))
		.pipe(rename((f) => handleViewNames(f)))
		.pipe(dest(config.outputPath))

	cb()
}