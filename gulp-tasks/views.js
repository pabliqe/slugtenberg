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
const csv = require('csv-parser')
const liquid = require('@tuanpham-dev/gulp-liquidjs')
const md = require('markdown-it')({
	html: true,
	linkify: true,
	typographer: true
})
const yaml = require('yaml')

/* Customs */
const config = require('./config.js')

const LOADED_DATA = {}
const ENGINE_OPTS = {
	engine: {
		cache: false,
		root: [
			'src/layouts',
			'src/includes'
		],
		strictFilters: true,
		//strictVariables: true,
		extname: config.typeTemplate
	},
	filters: {

		/* Slug */
		slugLink: (a) => config.baseUrl + '/' + a,
		assetLink: (a) => config.assetUrl + '/' + a,
		makeSlug: (a) => makeSlug(a),
		unmakeSlug: (a) => unmakeSlug(a),

		/* Counters */
		max: (a,b) => (a > b) ? b : a,
		min: (a,b) => (!a) ? a : (a < b) ? b : a,

		/* Arrays */
		randomize: (a) => shuffleArray(a),
		randomFirst: (a) => a[Math.floor(Math.random(a.length))],
		whereNot: (a,b,c) => a.filter((v,i) => !(b in v) || (c && v[b] !== c)),
		whereLess: (a,b,c) => a.filter((v,i) => (b in v) && v[b] <= c),
		whereGreater: (a,b,c) => a.filter((v,i) => (b in v) && v[b] >= c)
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

function extendSlug(input) {
	let output = {}

	switch(typeof input) {
		case 'object':
			output = input

			// Parse object for slug
			walkObj(output,
				
				// Condition: match key slug
				(k, o) => (k == 'slug'),

				// Action: append slug data
				(v, o) => {
					return extend(o, {
						media: parseSlugFiles(v, 'media'),
						content: parseSlugFiles(v, 'content')
					}, parseSlugFiles(v, 'data'))
				}
			)

			break
		
		case 'string':
			let s = getFileName(input)
			if(s == 'index') s = getParentName(input)
			if(s == 'slugs') s = 'index'

			// Parse filepath
			output = extend({
				media: parseSlugFiles(s, 'media'),
				content: parseSlugFiles(s, 'content')
			}, parseSlugFiles(s, 'data'))

			log('Extending «' + s + '» slug', output)

			break
	}

	return output
}

function parseSlugFiles(slug, type) {
	let output = {}

	switch (type) {
		case 'content':
			// Parse Markdown and append...
			glob.sync('src/slugs/**/' + slug + '/*+(' + config.typeContent + ')', ) // Matches slug childs
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
			let df = glob.sync('src/slugs/**/' + slug + '+(' + config.typeData + ')') // Matches slug file
			if(df.length)
				output = parseDatafile(df[0])
			break
	}

	return output
}

function makeSlug(str) {
	if(!str) return ''

	return str
		.trim()
		//.replace(/_/g, '--')
		//.replace(/\s/g, '-')
		//.toLowerCase()
		//.replace(/[\<\>\[\]\(\)¿\?\¡\!\%\"|'\+]/g, '')
		.replace(/_/g, '--')
		.replace(/ /g, '_')
		/* https://www.regextester.com/94757 */
		.replace(/[^A-Za-z0-9\-\_\u00C0-\u00D6\u00D8-\u00f6\u00f8-\u00ff]/g, '')
		//.toLowerCase()
}

function unmakeSlug(str) {
	if(!str) return ''

	return str
		.replace(/_/g, ' ')
		.replace(/--/g, '_')
		.replace(/^\w/, (c) => c.toUpperCase())
}

function getFileExt(file) {
	return path.extname(file).replace(/^\./, '')
}

function getFileName(file, includeExt) {
	return !includeExt ? path.basename(file).replace(/\.(\w+)$/, '') : path.basename(file);
}

function getParentName(file) {
	return path.dirname(file).replace(/^([\w\-_\/]*)\//, '')
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

function parseMarkdown(content) {
  return md.render(content)
}

function parseMarkdownFile(file) {
	return parseMarkdown(fs.readFileSync(file, "utf8"))
  }

function parseDatafile(file) {
	switch(getFileExt(file)) {
		case 'json':
			return JSON.parse(fs.readFileSync(file, 'utf-8'))
		
		case 'yml':
			return yaml.parse(fs.readFileSync(file, 'utf-8'))
	}
}

function loadCsvFile(file) {
	log('▶︎▶︎▶︎ Loading data from «' + file + '»')

	let dataDir = 'src/data'
	let fileConfig = {
		name: getFileName(file)
	}

	glob.sync(dataDir + '/' + fileConfig.name + '.yml')
		.forEach((v,i,a) => {
			extend(fileConfig, parseDatafile(v));
		
			log('Data config found', fileConfig);
		});
	
	fs.createReadStream(dataDir + '/' + file)
		.pipe(csv({
			mapHeaders: ({ header, index }) => {
				return makeSlug(header)
			},
			mapValues: ({ header, index, value }) => {
				if('columns' in fileConfig && header in fileConfig.columns) {
					if(!value) {
						value = ''

					} else if(fileConfig.columns[header].type == 'array') {
						value = String(value).split(',')
					}
				}
				
				return value
			}
		}))
		.on('data', (d) => {
			if(!(fileConfig.name in LOADED_DATA))
				LOADED_DATA[fileConfig.name] = new Array()

			LOADED_DATA[fileConfig.name].push(d)
		})
		.on('end', function() {
			log('Data loaded: ' + LOADED_DATA[fileConfig.name].length)

			if(fileConfig.use_layout) {
				LOADED_DATA[fileConfig.name].forEach((v,i,a) => {
					v.slug = makeSlug((i + 1) + '-' + v[fileConfig.column_slug]);

					src('src/layouts/' + fileConfig.use_layout + '+(' + config.typeTemplate + ')')
						.pipe(data((f) => {
							return {
								current: extendSlug(v),
								config: config,
								data: LOADED_DATA
							}
						}))
						.pipe(liquid(ENGINE_OPTS))
						.pipe(rename(v.slug + '.html'))
						.pipe(dest(config.outputPath + '/' + fileConfig.name))
				})
			}
		})
}

/* ——————————————————— INITIALIZER —————————————————————— */

module.exports = () => {
	
	// Append global data files
	glob.sync('src/data/**/*.csv')
		.forEach((v,i,a) => loadCsvFile(v))
	
	return src([
			'src/slugs/**/*+(' + config.typeTemplate + ')',  // Ext force to read files only
			'!src/**/_*/',
			'!src/**/_*/**/*'
		])
		.pipe(rename((f) => log('▶︎▶︎▶︎ Building view: ' + f.dirname + '/' + f.basename)))
		.pipe(data((f) => {
			return {
				current: extendSlug(f.path),
				config: config,
				data: LOADED_DATA
			}
		}))
		.pipe(liquid(ENGINE_OPTS))
		.pipe(rename((f) => {
			
			// Move index files to parent folder (cleanUrls)
			if(f.basename == 'index' && f.dirname != '.') {
				return {
					dirname: '',
					basename: f.dirname,
					extname: f.extname
				}
			}
		}))
		.pipe(dest(config.outputPath))
}