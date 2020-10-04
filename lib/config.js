/* Happy Coding!.⋆✦
—————————————————————————————————————————————————————————
file:			lib/config.js
version: 		0.0.1
last_changes:	.
—————————————————————————————————————————————————————————
*/
const extend = require('extend')
const args = require('yargs').argv
const fs = require('fs')
const yaml = require('yaml')

let defaults = {
	baseUrl: '',
	cdnUrl: '',
	siteTitle: 'Slutenberg Demo',
	siteLanguage: 'en',
	src: 'src',
	dev: 'dist-dev',
	dist: 'dist',
	assets: 'assets'
}

// If theres a config file
try{

	// Replace defaults by manual configs
	extend(defaults,
		yaml.parse( fs.readFileSync(args.path + '/slugtenberg.yml', 'utf8') ))

} catch(e) {
	if(!e.message.match(/ENOENT/i))
		throw e
}

console.log(args)

module.exports = extend(defaults, {

	// General
	debug: process.env.NODE_ENV !== 'production',
	rootPath: args.path,
	outputPath: args.path + '/' + (process.env.NODE_ENV !== 'production' ? defaults.dev : defaults.dist),
	assetsUrl: `${defaults.cdnUrl}/${defaults.assets}/`,
	stylesUrl: `${defaults.cdnUrl}/${defaults.assets}/styles.css`,
	scriptsUrl: `${defaults.cdnUrl}/${defaults.assets}/scripts.css`,

	// File Types
	typeTemplate: '.liquid|.html',
	typeContent: '.md|.markdown',
	typeText: '.txt',
	typeData: '.json|.yml',
	typeDataSheet: '.csv',
	typeStyle: '.scss|.sass|.css',
	typeScript: '.js',
	typeMedia: '.jpg|.jpeg|.png|.gif|.svg|.ico|.mp3|.mp4|.oga|.ogg|.wav|.webm',
	typeLink: '.webloc|.xml',

	// Parsers
	viewCache: false,
	viewRoots: [
		`${args.path}/${defaults.src}/layouts`,
		`${args.path}/${defaults.src}/includes`
	],
	strictFilters: true,
	strictVariables: false
})