import { app, BrowserWindow } from 'electron';
import path from 'path';
import os from 'os';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let mainWindow;

function isWSL() {
  try {
    return os.release().toLowerCase().includes('microsoft') ||
      execSync('uname -r').toString().toLowerCase().includes('microsoft');
  } catch {
    return false;
  }
}

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

  // 👇 Load the index.html from the dist folder
  const indexPath = path.join(__dirname, 'dist/index.html');
  mainWindow.loadFile(indexPath);

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (mainWindow === null) createWindow();
});
