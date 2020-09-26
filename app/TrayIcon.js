const path = require('path');
const { BrowserWindow, Tray } = require('electron');
// Electron-positioner - npm package for positioning of the Tray Window. Our Tray Window should appear under the Tray icon.

const Positioner = require('electron-positioner');

class TrayIcon {
  constructor(trayWindow) {
    // Path to the app icon that will be displayed in the Tray (icon size: 22px)
    let iconPath = path.join(__dirname, 'icon.png')

    this.trayIcon = new Tray(iconPath);
    this.trayIcon.setToolTip('Time Tracker'); // This tooltip will show up, when user hovers over our tray-icon.

    // By clicking on the icon we have to show TrayWindow and position it in the middle under the tray icon (initialy this window is hidden).

    this.trayIcon.on('click', (e, bounds) => {
      if ( trayWindow.isVisible() ) {
        trayWindow.hide();
      } else {
        let positioner = new Positioner(trayWindow);
        positioner.move('trayCenter', bounds)

        trayWindow.show();
      }
    });
  }
}

module.exports = TrayIcon;