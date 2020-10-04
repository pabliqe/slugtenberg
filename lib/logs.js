/* Happy Coding!.⋆✦
—————————————————————————————————————————————————————————
file:			lib/logs.js
version: 		0.0.1
last_changes:	.
—————————————————————————————————————————————————————————
*/
const log = require('fancy-log')
const through = require('through2')
const chalk = require('chalk')

// Customs
const config = require('./config')

function logAny () {
	if(typeof arguments[0] == 'string')
		arguments[0] = chalk.grey(arguments[0])

	log.apply( this, arguments )
}

function logBreak (str, colored) {
	
	console.log('[' + chalk.yellow('  :  :  ') + '] ' + chalk.grey('————————————————————————'))

	if(!str)
		return

	if(colored) {
		if(typeof colored == 'string')
			colored = Array(colored);

		str = String(str).replace(/\$(\d)/g, (i) => chalk.black.bgYellow(colored[Number(i.slice(1))-1]))
	}

	log(str)
}

function logFiles (str, customDir) {

	return through.obj((file, encoding, callback) => {

		if (file.isNull()) {
			this.push(file)
			return callback();
		}

		log((str ? str + ' ' : 'Reading ') + chalk.green(customDir ? customDir : String(file.dirname).replace(process.cwd(), '') + '/' + file.relative) + '...')

		callback(null, file);
  });
}

module.exports = {
	loga: logAny,
	logb: logBreak,
	logf: logFiles
};