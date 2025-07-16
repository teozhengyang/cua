import { app, BrowserWindow } from 'electron';
import os from 'os';
import { execSync } from 'child_process';

let mainWindow;

// Optional: Auto-disable GPU if running in WSL
function isWSL() {
  try {
    return os.release().toLowerCase().includes('microsoft') ||
      execSync('uname -r').toString().toLowerCase().includes('microsoft');
  } catch {
    return false;
  }
}

// 💡 Disable GPU to prevent OpenGL/ANGLE issues in WSL2
if (isWSL()) {
  console.log('⚠️ Running in WSL. Disabling GPU acceleration...');
  app.commandLine.appendSwitch('disable-gpu');
  app.disableHardwareAcceleration();
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
    }
  });

  mainWindow.loadURL('http://localhost:5173'); // Load your React app

  mainWindow.on('closed', function () {
    mainWindow = null;
  });
}

app.on('ready', createWindow);

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow();
  }
});
