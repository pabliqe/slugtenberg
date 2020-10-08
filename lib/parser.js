/* Happy Coding!
—————————————————————————————————————————————————————————
file:			lib/parser.js
version: 		0.0.3
last_changes:	promises and async functions
—————————————————————————————————————————————————————————
*/
const log = require('fancy-log')
const extend = require('extend')
const fs = require('fs')
//const  fs = require('fs').promises
const path = require('path')
const del = require('del')

// File Parsers
//const csv = require('csv-parseFile')
const RSS = require('rss-parser')
const rss = new RSS()
const csv = require('csv-parse/lib/sync')
const xml = require('xml2json')
const md = require('markdown-it')({
	html: true,
	linkify: true,
	typographer: true
})
const yaml = require('yaml')

// Customs
const config = require('./config.js')
const { logf, loga, logb } = require('./logs.js')
const TYPE_TEXT = new RegExp('(' + config.typeText + ')$')
const TYPE_CONTENT = new RegExp('(' + config.typeContent + ')$')
const TYPE_MEDIA = new RegExp('(' + config.typeMedia + ')$')
const TYPE_LINK = new RegExp('(' + config.typeLink + ')$')
const TYPE_DATASHEET = new RegExp('(' + config.typeDataSheet + ')$')
const TYPE_FEED = new RegExp('(' + config.typeRSS + ')$')
const TYPE_TEMPLATE = new RegExp('(' + config.typeTemplate + ')$')
const BASE_DIRS = new RegExp('src|data|slugs|improts|media|includes|layouts|styles|scripts')

/* ——————————————————— HELPERS —————————————————————— */

function walkObj(obj, condition, action) {

	Object.entries(obj).forEach((v,i,a) => {
		if(typeof obj[v[0]] == "object")
			walkObj(obj[v[0]], condition, action)
			
		else if(condition(v[0], obj))
			action(obj[v[0]], obj)
	})
}


function getFileExt(fpath) {
	return path.extname(fpath).replace(/^\./, '')
}

function getFileName(fpath, ext) {
	return !ext ? path.basename(fpath).replace(/\.(\w+)$/, '') : path.basename(fpath)
}

function getSafeDir(fpath) {
	if(fpath == '.')
		return

	return path.relative(process.env.PWD, path.dirname(fpath))
}

/* ——————————————————— RETURNS —————————————————————— */

function getParentSlug(fpath) {
	return getAllParentSlug(fpath).reverse()[0]
}

function getAllParentSlug(fpath) {
	if(fpath == '.')
		return []

	let dir = path.relative(process.env.PWD, fpath)
	if(!dir)
		return []

	return dir
	
		// Split directories
		.match(/([^\/]+)\/?/g)
		
		// Clean base dirs
		.filter((d) => !BASE_DIRS.test(d))

		// Remove trailing slash
		.map((d) => d.replace(/\/$/, ''))

		// Prepare slugs to be created
		//.map((d) => makeSlug(d))
}

function makeSlug(str) {
	return String(str)
		.toLowerCase()
		.trim()
		//.replace(/_/g, '--')
		.replace(/ /g, '_')
		.normalize("NFD") // remove latin chars (https://developer.mozilla.org/es/docs/Web/JavaScript/Referencia/Objetos_globales/String/normalize)
		.replace(/[^A-Za-z0-9\-\_]/g, '')
		.replace(/[\u0300-\u036f]/g, '')
}

function unmakeSlug(str) {
	if(!str) return ''

	return String(str)
		// [!] latin chars wont get back
		.replace(/_/g, ' ')
		.replace(/(^\w|\s\w)/g, function(char) {
			return char.toUpperCase();
		});
}

function safeSlug(fpath) {
	if(!fpath)
		return 'undefined'

	let slug = makeSlug(getFileName(fpath))
	let parent = getParentSlug(getSafeDir(fpath))

	// Try with parent folder name
	if(slug == 'index' && parent)
		slug = makeSlug(parent)

	return slug
}

function cleanGeneratedFiles () {
	return del('dist?(-dev)/**', {
		force:true
	});
}

/* ——————————————————— ASYNC —————————————————————— */

/*function extendSlugs(obj) {
	let promises = []

	walkObj(obj,
				
		// [CONDITION] Match key slug
		(k, o) => (k == 'slug'),

		// [ACTION] Append slug data
		(v, o) => {
			promises.push( parseSlug(v) )
		})

	return Promise.all(promises)
		.then((content) => extend(o, content))
		.catch((err) => console.error(err))
}*/

function parseSlug(fpath) {
	let s = safeSlug(fpath)
	let dir = 'src/slugs/' + getAllParentSlug(getSafeDir(fpath)).join('/')
	let output = {}
		
	return parseFolder(dir, false, [config.typeContent, config.typeLink, config.typeMedia, config.typeText].join('|'), parseFile, true)
		.then((content) => {

			extend(output, {
				current: s
			}, content[s])

			//console.log('???', s, output)

			return output
		})
		.catch((err) => {
			console.log(err)
		})
}

function parseFolder(dir, name, ext, promise, lazy) {

	return new Promise((res, rej) => {
		let promises = []
	
		if(!fs.existsSync(dir))
			return rej(Error('Unkown folder parsed: ' + dir ))
	
		fs.readdirSync(dir)
	
			// Exclude /. and /..
			.filter( (v) => typeof v == 'string' && /^[^\._]/.test(v) )
					
			// Apply custom filters
			.filter(
				// Continue if folder...
				(v) => fs.lstatSync(dir + '/' + v).isDirectory()

				// or if name/ext matches any...
				|| (( name ? new RegExp(name).test(v) : true )
				&& (ext ? new RegExp('\.(' + ext + ')$').test(v) : true )))
	
			.forEach((fname) => {
				//console.log('>', dir, name, ext, fname, fs.lstatSync(dir + '/' + fname).isDirectory())
				
				if( fs.lstatSync(dir + '/' + fname).isDirectory() ) {
					if(lazy) return
	
					promises.push( parseFolder(dir + '/' + fname, false, false, promise) )
					
				} else if(typeof promise == 'function') {
					//promises.push( parseFile(dir + '/' + fname) )
					promises.push( promise(dir + '/' + fname) )
				}
			})
	
		Promise
			.all(promises)
			.then((results) => {
	
				let output = {}
				let curDir = safeSlug(dir)
	
				// Handle sub-folders such ./src/data/articles
				if(!(curDir in output))
					output[curDir] = {}
	
				// Starts building data structure
				results.forEach((contents) => {
	
					let isFile = 'type' in contents
					let isEmpty = Object.keys(contents).length == 0
	
					// Empty folder output
					if(isEmpty) {
						return new Error('Empty folder ' + dir)
	
					} else if (!isFile) {
						extend(output[curDir], contents)
	
						//console.log('>>>', dir, output)
	
					// Known parsed contents detected...
					} else {
	
						// Text-Markdown files
						if (TYPE_TEXT.test(contents.type) || TYPE_CONTENT.test(contents.type)) {
					
							if(!('contents' in output[curDir]))
								output[curDir].contents = {}
							
							output[curDir].contents[contents.name] = contents.contents
				
						// Media files
						} else if(TYPE_MEDIA.test(contents.type)) {
				
							if(!('media' in output[curDir]))
								output[curDir].media = {}
				
							output[curDir].media[contents.name] = contents.contents
				
						// Link files
						} else if(TYPE_LINK.test(contents.type)) {
							
							if(!('links' in output[curDir]))
								output[curDir].links = {}
		
							output[curDir].links[contents.name] = contents.contents
	
						// View files
						} else if(TYPE_TEMPLATE.test(contents.type)) {
				
							output[curDir].view = getAllParentSlug(getSafeDir(contents.path)).map((v) => makeSlug(v)).join('/') + '/' + makeSlug(contents.name) + '.html'
	
						// Generic Data files (JSON)
						} else {
							output[curDir] = contents.contents
						}
	
						//console.log('>>>>', dir, output)
					}
	
				}) // end foreach
	
				return res(output)
	
			}) // end then
	
			.catch((err) => {
				console.error(err)
			})
	})
}

function parseImport(fpath) {
	
	return new Promise((res, rej) => {

		parseFile(fpath).then((file) => {
			
			let s = file.name
			let d = getSafeDir(file.path)
			let o = file.contents
			let output = {
				name: s,
				config: o,
				type: 'import'
			}

			if(!('type' in o))
				return rej(new Error('Import type must be setup'))

			setTimeout(() => {
				logb('Importing $1 data from $2...', [o.type, fpath])

				switch(o.type) {
					case 'csv':
						let csvOptions = {
							columns: (header) => header.map((h) => {

								// convert header to slugs
								let hh = makeSlug(h)

								if('columns' in o
									&& hh in o.columns) {
									
									if('alias' in o.columns[hh])
										hh = o.columns[hh].alias
								}
								
								loga(`Header for ${s}:`, hh)

								return hh
							}),
							cast: (value, context) => {

								// search for header in 'columns' configuration
								if('columns' in o && context.header in o.columns) {
									if(o.columns[context.header].type == 'array')
										value = String(value).split(',')
								}
								
								return value
							} 
						}

						loga('Importing from...', d + '/' + o.path)
						
						// Save global data extracted from sheet
						parseFile(d + '/' + o.path, csvOptions)
							.then((content) => {
								loga('Data loaded:', content.contents.length + ' ' + typeof content.contents + 's')

								output.contents = content.contents

								return res(output)
							})
						break

					case 'rss':

						loga('Importing from...', o.url)

						rss.parseURL(o.url, (err, feed) => {
							if(err)
								return rej(err)

							output.contents = feed
								
							return res(output)
						})
						break

					default:
						return rej('Unknown file type! ' + fpath)
						
				} // end switch
			}, 0)

		}) // parseFile

	})

	.catch((err) => {
		console.error(err)
	})
}

function parseFile(fpath, options) {

	return new Promise((res, rej) => {
		if(!options)
			options = {}

		let output = {
			name: getFileName(fpath),
			type: getFileExt(fpath),
			path: fpath
		}

		setTimeout(() => {
			logb('Parsing file... $1', fpath)

			switch(output.type) {
				case 'jpg':
				case 'png':
				case 'gif':
					output.contents = config.cdnUrl + '/assets/' + getAllParentSlug(getSafeDir(fpath)).join('/') + '/' + output.name + '.' + output.type
					return res(output)

				case 'md':
				case 'markdown':
					output.contents = md.render(fs.readFileSync(fpath, 'utf8'), options)
					return res(output)

				case 'json':
					output.contents = JSON.parse(fs.readFileSync(fpath, 'utf-8'), options)
					return res(output)

				case 'yml':
					output.contents = yaml.parse(fs.readFileSync(fpath, 'utf-8'), options)
					return res(output)

				case 'csv':
					output.contents = csv(fs.readFileSync(fpath, 'utf-8'), options)
					return res(output)

				case 'webloc':
					output.contents = JSON.parse(xml.toJson(fs.readFileSync(fpath, 'utf-8')))
					output.contents = output.contents.content.plist.dict.string
					return res(output)

				case 'rss':
					rss.parseString(fs.readFileSync(fpath, 'utf8'), (err, feed) => {
						if(err)
							return rej(err)

						output.contents = feed
						return res(output)
					})
					break

				case 'txt':
					output.contents = fs.readFileSync(fpath, 'utf8')
					return res(output)

				case 'liquid':
				case 'html':
					output.contents = ''
					return res(output)

				default:
					/*fs.readFile(fpath, 'utf-8', (err, content) => {
						if(err)
							rej(err)
						
						output.contents = content
						return res(output)
					})*/
					return rej('Unknown file type! ' + fpath)
			}
		}, 0)

	}) // end promise

	.then((file) => {
		loga(`OK ${file.type} file outputs`, file.contents)

		return file
	})

	.catch((err) => {
		console.error(err)
	})
}

/* ——————————————————— INITIALIZER —————————————————————— */

module.exports = {
	make: makeSlug,
	unmake: unmakeSlug,
	safe: safeSlug,
	name: getFileName,
	ext: getFileExt,
	dir: getSafeDir,
	parent: getParentSlug,
	parents: getAllParentSlug,
	clean: cleanGeneratedFiles,
	//extend: extendSlugs,
	load: parseSlug,
	search: parseFolder,
	read: parseFile,
	import: parseImport,
}