/* Happy Coding!.⋆✦
—————————————————————————————————————————————————————————
file:			lib/parser.js
version: 		0.0.2
last_changes:	fixed getParentName way to obtain path
				without filenames, and trailing slashes
—————————————————————————————————————————————————————————
*/
const log = require('fancy-log')
const extend = require('extend')
const fs = require('fs')
const path = require('path')
const del = require('del')

// parseFiles
//const csv = require('csv-parseFile')
const csv = require('csv-parse/lib/sync')
const xml = require('xml2json')
const md = require('markdown-it')({
	html: true,
	linkify: true,
	typographer: true
})
const yaml = require('yaml')

// Customs
const config = require('./config')
const {logf, loga, logb} = require('./logs')

/* ——————————————————— FUNCTIONS —————————————————————— */

function getFileExt(filepath) {
	return path.extname(filepath).replace(/^\./, '')
}

function getFileName(filepath, ext) {
	return !ext ? path.basename(filepath).replace(/\.(\w+)$/, '') : path.basename(filepath)
}

function getParentName(filepath, i) {

	// Clean root path for safer manipulation
	// dirname() returns on base .
	//let dir = path.dirname(filepath)
	let dir = filepath.replace(/^(\.|src)\/?((data|slugs)\/?)?/g, '')
	if(!dir)
		return ''

	if(dir.match(/\//)) {
		if(i) {
		
			// Count and grab parent folders at index
			dir = dir.match(/[^\/]+\/?/g).reverse()
			dir = dir[i]
	
		} else {
	
			// Grab parent folders
			dir = dir.match(/[^\/]+\/?/g)
			dir = dir[dir.length-1]
		}
	}

	// Remove trailing slash
	dir = dir ? dir.replace(/\/$/, '') : ''
	return dir;
}

function getParentsName(filepath) {
	//let dir = path.dirname(filepath)
	if(dir == 'src' || dir == 'data' || dir == 'slugs' || dir == '.')
		return '';
	
	return dir.match(/([\s\w\-_]*)\//g);
}

function makeSlug(str) {
	if(!str) return ''

	return String(str)
		.toLowerCase()
		.trim()
		.replace(/_/g, '--')
		.replace(/ /g, '_')
		.replace(/[^A-Za-z0-9\.\-\_\u00C0-\u00D6\u00D8-\u00f6\u00f8-\u00ff]/g, '')
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
	/*let parent = getParentName(path.dirname(fpath))

	// Try with parent folder name
	if(slug == 'index' && parent)
		slug = makeSlug(parent)*/

	return slug
}

function extendSlug(slug) {
	let output = {}
	let dir = `${config.src}/slugs/`

	if(fs.existsSync(dir + slug))
		output = parseFolder(dir + slug)

	config.typeData.split('|').forEach((v,i,a) => {
		if(fs.existsSync(dir + slug + v)) {
			extend(output, parseFile(dir + slug +  v))	
		}
	})

	return output;
}

function parseFolder(dir, filetype, options) {
	let output = {}
	
	fs.readdirSync(dir)
	
		// Grab only file strings 
		.filter((v) => typeof v == 'string' && /^[^\._]/.test(v) )
	
		// Apply custom filters 
		.filter((v) => typeof filetype == "undefined" ? true : new RegExp('\.(' + filetype + ')$').test(v))
		
		.forEach((v,i,a) => {
			
			// Text files
			if(v.match(new RegExp('\.(' + config.typeText + ')$'))) {
	
				if(!('contents' in output))
					output.contents = {}
	
				output.contents[safeSlug(v)] = parseFile(dir + '/' + v, options);
	
			// Content files
			} else if(v.match(new RegExp('\.(' + config.typeContent + ')$'))) {
	
				if(!('contents' in output))
					output.contents = {}
	
				output.contents[safeSlug(v)] = parseFile(dir + '/' + v, options);
	
			// Media files
			} else if(v.match(new RegExp('\.(' + config.typeMedia + ')$'))) {
	
				if(!('media' in output))
					output.media = {}
	
				output.media[safeSlug(v)] = config.cdnUrl + '/assets/' + safeSlug(dir) + '/' + makeSlug(v)
	
			// Link files
			} else if(v.match(new RegExp('\.(' + config.typeLink + ')$'))) {
	
				if(!('links' in output))
					output.links = {}
	
				let webloc = parseFile(v, options)
				output.links[safeSlug(v)] = webloc.plist.dict.string;
	
			// CSV files
			} else if(v.match(new RegExp('\.(' + config.typeDataSheet + ')$'))) {
				extend(output, parseFile(dir + '/' + v, options))
	
			// Data files
			/*} else if(v.match(new RegExp('\.(' + config.typeData + ')$'))) {
				extend(output, parseFile(dir + '/' + v, options))*/
	
			// Jump to next folder
			//} else if(!getFileExt(v)) {
			} else if(fs.lstatSync(dir + '/' + v).isDirectory()) {
				output[safeSlug(v)] = parseFolder(dir + '/' + v, filetype, options);
			}
		})

	return output;
}

function parseFile(filepath, options) {
	if(!options)
		options = {}

	switch(getFileExt(filepath)) {
		case 'md':
		case 'markdown':
			return md.render(fs.readFileSync(filepath, "utf8"), options)

		case 'json':
			return JSON.parse(fs.readFileSync(filepath, 'utf-8'), options)
		
		case 'yml':
			return yaml.parse(fs.readFileSync(filepath, 'utf-8'), options)
		
		case 'csv':
			return csv(fs.readFileSync(filepath, 'utf-8'), options)

		case 'webloc':
			return JSON.parse(xml.toJson(fs.readFileSync(filepath, 'utf-8'), options))

		default:
			return fs.readFileSync(filepath, 'utf-8')
	}
}

function deleteFolders () {
	return del('dist?(-dev)/**', {
		force:true
	});
}

/* ——————————————————— INITIALIZER —————————————————————— */

module.exports = {
	make: makeSlug,
	unmake: unmakeSlug,
	safe: safeSlug,
	load: extendSlug,
	parent: getParentName,
	parents: getParentsName,
	ext: getFileExt,
	name: getFileName,
	search: parseFolder,
	read: parseFile,
	clean: deleteFolders
}