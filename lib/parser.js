const log = require('fancy-log')
const extend = require('extend')
const fs = require('fs')
const path = require('path')

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
const config = require('./config.js')

/* ——————————————————— FUNCTIONS —————————————————————— */

function getFileExt(filepath) {
	return path.extname(filepath).replace(/^\./, '')
}

function getFileName(filepath, ext) {
	return !ext ? path.basename(filepath).replace(/\.(\w+)$/, '') : path.basename(filepath)
}

function getParentName(filepath, i) {

	// Clean root path for safer manipulation
	let dir = path.dirname(filepath).replace(/^(\.|src)(\/)?((data|slugs)(\/))?/g, '') // dirname() returns .
	if(!dir)
		return ''
		
	if(i) {
		// Count and grab parent folders at index
		dir = dir.match(/([\s\w\-_]*)(\/)?/g).reverse()[i];

	} else {
		// Grab parent folders
		dir = dir.match(/([\s\w\-_]*)(\/)?/g)
		dir = dir[dir.length]
	}
	
	return dir;
}

function getParentsName(filepath) {
	let dir = path.dirname(filepath)
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
	let parent = getParentName(fpath)

	// Try with parent folder name
	if(slug == 'index' && parent)
		slug = makeSlug(parent)

	return slug
}

function extendSlug(slug) {
	let output = {}

	if(fs.existsSync('src/slugs/' + slug))
		output = parseFolder('src/slugs/' + slug)

	return output;
}

function parseFolder(dir) {
	let output = {};

	fs.readdirSync(dir)
		.filter((dir) => typeof dir == 'string' && dir[0] !== '.' )
		.forEach((v,i,a) => {

			// Text files
			if(v.match(new RegExp('\.(' + config.typeText + ')$'))) {
				if(!('contents' in output))
					output.contents = {}
		
				output.contents[safeSlug(v)] = parseFile(dir + '/' + v);
		
			// Content files
			} else if(v.match(new RegExp('\.(' + config.typeContent + ')$'))) {
				if(!('contents' in output))
					output.contents = {}
		
				output.contents[safeSlug(v)] = parseFile(dir + '/' + v);
		
			// Media files
			} else if(v.match(new RegExp('\.(' + config.typeMedia + ')$'))) {
				if(!('media' in output))
					output.media = {}

				output.media[safeSlug(v)] = config.cdnUrl + '/assets/' + safeSlug(dir) + '/' + makeSlug(v)

			// Data files
			} else if(v.match(new RegExp('\.(' + config.typeData + ')$'))) {

				extend(output, parseFile(dir + '/' + v))

			// Link files
			} else if(v.match(new RegExp('\.(' + config.typeLink + ')$'))) {
				if(!('links' in output))
					output.links = {}

				let webloc = parseFile(v)
				output.links[safeSlug(v)] = webloc.plist.dict.string;

			} else if(!getFileExt(v)) {
				output[safeSlug(v)] = parseFolder(dir + '/' + v);
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
	read: parseFile
}