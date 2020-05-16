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
const xml = require('xml2json')
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

function getFileExt(fpath) {
	return path.extname(fpath).replace(/^\./, '')
}

function getFileName(fpath, ext) {
	return !ext ? path.basename(fpath).replace(/\.(\w+)$/, '') : path.basename(fpath)
}

function getParentName(fpath) {
	let dir = path.dirname(fpath)
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

function safeSlug(fpath) {
	if(!fpath) return ''

	let slug = makeSlug(getFileName(fpath))
	let parent = getParentName(fpath)

	// Try with parent folder name
	if(slug == 'index' && (parent && parent != 'slugs'))
		slug = makeSlug(parent)

	return slug
}

function handleSlugs(pipe) {
	let s = safeSlug(pipe)
	
	switch(typeof pipe) {
		
		// Parsing direct slug from path
		case 'string':
			pipe = extend({
				current: s,
				config: config,
				data: LOADED_DATA,
			}, getSlugData(s))

		// Parse object for slug
		case 'object':
			walkObj(pipe,
				
				// [CONDITION] Match key slug
				(k, o) => (k == 'slug'),

				// [ACTION] Append slug data
				(v, o) => {
					extend(o, getSlugData(v))
				}
			)


		log('Extending «' + s + '»', pipe)

		return pipe;
	}
}

function handleFileName(fs) {

	// Index files works better on parent folder (cleanUrls)
	if(fs.basename == 'index' && fs.dirname != '.') {

		return {
			dirname: fs.dirname.replace(getParentName(fs.dirname), ''),
			basename: safeSlug(getParentName(fs.dirname)),
			extname: fs.extname
		}

	// Regular views are just some html
	} else {
		return {
			dirname: fs.dirname,
			basename: safeSlug(fs.dirname + '/' + fs.basename + fs.extname),
			extname: '.html'
		}
	}
}

function getSlugData(slug) {
	let output = {}

	// Parse Markdown and append...
	glob
		.sync('src/slugs/**/' + slug + '/**/*+(' + config.typeContent + ')') // Matches slug childs
		.forEach((v,i,a) => {
			let p = getParentName(v)
			let f = getFileName(v)
			let c = parseMarkdownFile(v)

			if(!('contents' in output))
				output.contents = {}

			if(p != slug) {
				if(!(p in output.contents))
					output.contents[p] = {}
				output.contents[p][f] = c

			} else {
				output.contents[f] = c
			}
		})

	// Append media URL...
	glob
		.sync('src/slugs/**/' + slug + '/**/*+(' + config.typeMedia + ')') // Matches slug childs
		.forEach((v,i,a) => {
			let p = getParentName(v)
			let f = getFileName(v)

			if(!('media' in output))
				output.media = {}

			if(p != slug) {
				if(!(p in output.media))
					output.media[p] = {}
				output.media[p][f] = config.cdnUrl + '/assets/' + slug + '/' + p + '/' + getFileName(v, true)

			} else {
				output.media[f] = config.cdnUrl + '/assets/' + slug + '/' + getFileName(v, true)
			}
		})

	// Parse JSON and append...
	glob
		.sync('src/slugs/**/' + slug + '/**/*+(' + config.typeLink + ')') // Matches slug file
		.forEach((v,i,a) => {
			let p = getParentName(v)
			let f = getFileName(v)
			let webloc = parseDataFile(v)
			let u = webloc.plist.dict.string;

			if(!('links' in output))
				output.links = {}
			
			if(p != slug) {
				if(!(p in output.links))
					output.links[p] = {}
				output.links[p][f] = u

			} else {
				output.links[f] = u
			}
		})

	// Parse JSON and append...
	glob
		.sync('src/slugs/**/' + slug + '+(' + config.typeData + ')') // Matches slug file
		.forEach((v,i,a) => {
			extend(output, parseDataFile(v))
		})

	return output;
}

/* ——————————————————— PARSERS —————————————————————— */

function parseMarkdownFile(fpath, options) {
	if(!options)
		options = {}

	return md.render(fs.readFileSync(fpath, "utf8"), options)
}

function parseDataFile(fpath, options) {
	if(!options)
		options = {}

	switch(getFileExt(fpath)) {
		case 'json':
			return JSON.parse(fs.readFileSync(fpath, 'utf-8'), options)
		
		case 'yml':
			return yaml.parse(fs.readFileSync(fpath, 'utf-8'), options)
		
		case 'csv':
			return csv(fs.readFileSync(fpath, 'utf-8'), options)

		case 'webloc':
			return JSON.parse(xml.toJson(fs.readFileSync(fpath, 'utf-8'), options))
	}
}

function parseDataSheet(fpath, globals) {
	log('▶︎▶︎▶︎ Loading data from «' + fpath + '»')

	let fileOptions = {
		name: getFileName(fpath)
	}

	// Search for datasheet configuration files
	glob.sync(path.dirname(fpath) + '/' + fileOptions.name + '.yml')
		.forEach((v,i,a) => {
			extend(fileOptions, parseDataFile(v));
		
			log('Data config found:', fileOptions);
		});

	// Save global data extracted from sheet
	globals[fileOptions.name] = parseDataFile(fpath, {
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

	log('CSV data fully loaded: ' + globals[fileOptions.name].length)

	// If 'use_layout' output views from datasheet
	if(fileOptions.use_layout) {
		globals[fileOptions.name].forEach((v,i,a) => {
			v.slug = makeSlug((i + 1) + '-' + v[fileOptions.column_slug]);

			src('src/layouts/' + fileOptions.use_layout + '+(' + config.typeTemplate + ')')
				.pipe(rename((f) => log('▶︎▶︎▶︎ Building view (@data): ' + fileOptions.name + '/' + v.slug)))
				.pipe(data((f) => handleSlugs(v)))
				.pipe(liquid(ENGINE_OPTS))
				.pipe(rename((f) => handleFileName(v.slug)))
				// Group generated files on one folder
				.pipe(dest(config.outputPath + '/' + fileOptions.name))
		})
	}
}

/* ——————————————————— INITIALIZER —————————————————————— */

module.exports = (cb) => {
	
	// Append global data files
	glob.sync('src/data/**/*+(' + config.typeDataSheet + ')')
		.forEach((v,i,a) => parseDataSheet(v, LOADED_DATA))
	
	src([
			'src/slugs/**/*+(' + config.typeTemplate + ')',  // Ext force to read files only
			'!src/**/_*/',
			'!src/**/_*/**'
		])
		.pipe(rename((f) => log('▶︎▶︎▶︎ Building view: ' + f.dirname + '/' + f.basename)))
		.pipe(data((f) => handleSlugs(f.path)))
		.pipe(liquid(ENGINE_OPTS))
		.pipe(rename((f) => handleFileName(f)))
		.pipe(dest(config.outputPath))

	cb()
}