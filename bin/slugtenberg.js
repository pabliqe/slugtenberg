#!/usr/bin/env node
const yargs = require('yargs')

const argv = yargs
    .usage('Usage: $0 <command> [options]')
    .command({
        command: 'start',
        desc: 'Start project',
        builder: (yargs) => {
           return yargs
           
            .example('$0 start -p /Users/your_user/your_site', 'Loads your project remotely from other source')

            .alias('p', 'path')
            .nargs('p', 1)
            .default('p', '.')
            .describe('p', 'site source path')
            
            .help('help')
            .wrap(null)
        },
        handler: (argv) => {
            console.log('!!!!')
            
            let { build, start, watch } = require('../gulpfile') // import the gulp file


            //process.env.NODE_ENV = 'development';
            process.nextTick(async function(){
                /*await gulp.task('build')()
                gulp.task('start')(()=>{
                   gulp.task('watch')()
                })*/

                await build()
                start(() => {
                    watch()
                })
            })
        }
    })
    /*.command({
        command: 'build',
        desc: 'Build project',
        builder: (yargs) => {
           return yargs.example('$0 build -c slugtenberg.yml', 'build project using the given config file')
            .alias('c', 'config')
            .nargs('c', 1)
            .default('c','slugtenberg.yml')
            .describe('c', 'configuration file')
            .demandOption(['c'])
            .help('help')
            .wrap(null)
        },
        handler: (argv) => {
            //process.env.NODE_ENV = 'development';
            process.nextTick(async function(){
                //await gulp.task('build')()
                build()
            })
        }
    })
    .command({
        command: 'publish',
        desc: 'Build project ready to deploy',
        builder: (yargs) => {
           return yargs.example('$0 build -c slugtenberg.yml', 'build project using the given config file')
            .alias('c', 'config')
            .nargs('c', 1)
            .default('c','slugtenberg.yml')
            .describe('c', 'configuration file')
            .demandOption(['c'])
            .help('help')
            .wrap(null)
        },
        handler: (argv) => {
            //process.env.NODE_ENV = 'production';
            process.nextTick(async function(){
                //await gulp.task('build')()
                publish()
            })
        }
    })*/
    .help('help')
    .wrap(null)
    .argv

function checkCommands (yargs, argv, numRequired) {
    if (argv._.length < numRequired) {
        yargs.showHelp()
    }
}

checkCommands(yargs, argv, 1)

