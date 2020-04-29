const extend = require('extend')
const args = require('yargs').argv
const fs = require('fs')
const yaml = require('yaml')

/* Customs */
const config = yaml.parse(fs.readFileSync(args.dev ? './config-dev.yml' : './config.yml', 'utf8')) 

module.exports = extend({
	
	debug: args.dev,
	outputPath: args.dev ? 'dist-dev' : 'dist',

	/* File Types */
	typeTemplate: '.html|.liquid',
	typeContent: '.md|.markdown',
	typeData: '.json|.yml',
	typeStyle: '.scss|.sass',
	typeScript: '.js',
	typeMedia: '.jpg|.jpeg|.png|.mp4|.gif'
}, config)