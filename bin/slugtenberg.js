#!/usr/bin/env node
const yargs = require('yargs')
const gulp = require('gulp')

const argv = yargs
    .usage('Usage: $0 <command> [options]')
    .command({
        command: 'start',
        desc: 'Start project',
        builder: (yargs) => {
           return yargs.example('$0 start -c slugtenberg.yml', 'loads project using the given config file')
            .alias('c', 'config')
            .nargs('c', 1)
            .default('c','slugtenberg.yml')
            .describe('c', 'configuration file')
            .demandOption(['c'])
            .help('help')
            .wrap(null)
        },
        handler: (argv) => {
            require('../gulpfile') // import the gulp file
            process.nextTick(async function(){
                await gulp.task('build')()
                gulp.task('server:start')(()=>{
                   gulp.task('watch')()
                })
            })        
        }
    })
    .help('help')
    .wrap(null)
    .argv

function checkCommands (yargs, argv, numRequired) {
    if (argv._.length < numRequired) {
        yargs.showHelp()
    }
}
checkCommands(yargs, argv, 1)

