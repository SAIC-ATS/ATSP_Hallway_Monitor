const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    fullscreen: true,
    kiosk: false,
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      webSecurity: false, // Allow loading local files
      enableRemoteModule: true
    },
    backgroundColor: '#000000'
  });

  // Hide cursor
  mainWindow.webContents.on('did-finish-load', () => {
    mainWindow.webContents.insertCSS('* { cursor: none !important; }');
  });

  mainWindow.loadFile(path.join(__dirname, 'index.html'));

  // Prevent window from being closed accidentally
//   mainWindow.on('close', (e) => {
//     // Allow closing with Cmd+Q
//     if (!app.isQuitting) {
//       e.preventDefault();
//     }
//   });
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  app.quit();
});

// Quit the app when Cmd+Q is pressed
app.on('before-quit', () => {
  app.isQuitting = true;
});

// Handle quit request from renderer
ipcMain.on('quit-app', () => {
  app.isQuitting = true;
  app.quit();
});

// Disable hardware acceleration if needed for stability
// app.disableHardwareAcceleration();
