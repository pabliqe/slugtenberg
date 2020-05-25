const extend = require('extend')
const args = require('yargs').argv
const fs = require('fs')
const yaml = require('yaml')

// Customs
const config = yaml.parse(
	fs.readFileSync(
		args.dev ? './src/config-dev.yml' : './src/config.yml', 'utf8'
	)
)

module.exports = extend({
	
	debug: args.dev ? true : false,
	outputPath: args.dev ? 'dist-dev' : 'dist',
	assetsUrl: config.cdnUl + '/assets/',
	stylesLink: config.cdnUrl + '/assets/styles.css',
	scriptsLink: config.cdnUrl + '/assets/scripts.css',

	// File Types
	typeTemplate: '.liquid|.html',
	typeContent: '.md|.markdown',
	typeText: '.txt',
	typeData: '.json|.yml',
	typeDataSheet: '.csv',
	typeStyle: '.scss|.sass',
	typeScript: '.js',
	typeMedia: '.jpg|.jpeg|.png|.gif|.svg|.ico|.mp3|.mp4|.oga|.ogg|.wav|.webm',
	typeLink: '.webloc|.xml',

	// Parsers
	viewCache: false,
	viewRoots: [
		'src/layouts',
		'src/includes'
	],
	strictFilters: true,
	strictVariables: false
}, config)
