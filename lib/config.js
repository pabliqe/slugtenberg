/* Happy Coding!
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

// Customs
let config = {
	baseUrl: '',
	cdnUrl: '',
	siteTitle: 'Slutenberg Demo',
	siteLanguage: 'en',
	src: 'src',
	output: 'dist'
}

try{
	config = yaml.parse(
		fs.readFileSync(args.config, 'utf8')
	)
}catch(e){
	if(!e.message.match(/ENOENT/i)){
		throw e
	}
}

module.exports = extend(config, {

	// General
	debug: process.env.NODE_ENV !== 'production',
	assetsUrl: `${config.cdnUrl}/assets/`,
	stylesUrl: `${config.cdnUrl}/assets/styles.css`,
	scriptsUrl: `${config.cdnUrl}/assets/scripts.css`,

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
		`${config.src}/layouts`,
		`${config.src}/includes`
	],
	strictFilters: true,
	strictVariables: false
})
