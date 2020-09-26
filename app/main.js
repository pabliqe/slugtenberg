const { app, BrowserWindow, ipcMain } = require('electron')
const { exec,fork } = require('child_process')
const gulp = require('gulp')

require('../gulpfile') // import the gulp file

function createWindow () {
	// Create the browser window.
	const win = new BrowserWindow({
		width: 400,
		height: 400,
		webPreferences: {
			nodeIntegration: true
		}
	})

	// and load the index.html of the app.
	win.loadFile('index.html')

	ipcMain.on('build', function() {
		process.nextTick(async function(){
			gulp.task('build')()
		})
	})

	ipcMain.on('start', function() {
		process.nextTick(async function(){
			await gulp.task('build')()
			gulp.task('server:start')(() => {
				gulp.task('watch')()
			})
		})
			
		/*
		let gulpfile = fork('./gulpfile.js')
		process.nextTick(async function(){
			gulpfile.task('server:start')()
		})*/

		/*let asd = exec('npm run start', ( error, stdout, stderr ) =>
		{
			if( error )
			{
				// This won't show up until the process completes:
				console.log( '[ERROR]: "' + error.name + '" - ' + error.message );
				console.log( '[STACK]: ' + error.stack );
	
				console.log( stdout );
				console.log( stderr );
				return;
			}
	
			// Neither will this:
			console.log( stdout );
			console.log( stderr );
		})

		asd.on('data', (data) => {
			console.log(data)
		})*/
	})

	ipcMain.on('publish', function() {
		process.nextTick(async function(){
			await gulp.task('publish')()
		})
	})

	ipcMain.on('quit-app', function() {
		console.log('cerrando...')
	  	win.close(); // Standart Event of the BrowserWindow object.
	  	app.quit(); // Standart event of the app - that will close our app.
	});
}
 
  // This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(createWindow)

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

/*
// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

// These are two custom classes that we created only for our comfort.
const TrayWindow  = require('./TrayWindow.js');
const TrayIcon = require('./TrayIcon.js');

let tray = null;
let trayIcon = null;

// We hide dock, because we do not want to show our app as common app. We want to display our app as a Tray-like app (like Dropbox, Skitch or ets).
app.dock.hide();

// This event will be emitted when Electron has finished initialization.
app.on('ready', function () {
  tray = new TrayWindow();
  trayIcon = new TrayIcon(tray.window);
})

// Custom event created to close the app from Tray Window.
// The ipcMain module is used to handle events from a renderer process (web page).

ipcMain.on('quit-app', function() {
	console.log('cerrando...')
  tray.window.close(); // Standart Event of the BrowserWindow object.
  app.quit(); // Standart event of the app - that will close our app.
});
*/