/// <reference types="node" />

const { app, BrowserWindow, ipcMain, safeStorage } = require('electron') as typeof import('electron');
const path = require('node:path') as typeof import('node:path');

let mainWindow: import('electron').BrowserWindow | null = null;

function createWindow(): void {
  mainWindow = new BrowserWindow({
    width: 1080,
    height: 720,
    title: 'Barflow',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      webSecurity: true,
      preload: path.join(__dirname, 'preload.cjs')
    },
  });

  const url = 'http://localhost:8081';

  mainWindow.webContents.on('page-title-updated', (event: Electron.Event) => {
    event.preventDefault(); // Stops web pages/Expo from changing your title
  });

  // Load Expo Web bundle
  mainWindow.loadURL(url).catch(() => {
    console.log('Retrying connection to Metro server...');
    setTimeout(() => {
      mainWindow?.loadURL(url).catch((error: unknown) => {
        console.error('Unable to load the Expo web app. Start it with "npm run web".', error);
      });
    }, 2000);
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

ipcMain.handle('encrypt-token', async (_event, token: string): Promise<string> => {
  if (safeStorage.isEncryptionAvailable()) {
    const encryptedBuffer = safeStorage.encryptString(token);
    return encryptedBuffer.toString('base64');
  }
  throw new Error('Encryption is not available on this system');
});

ipcMain.handle('decrypt-token', async (_event, encryptedBase64: string): Promise<string> => {
  if (safeStorage.isEncryptionAvailable()) {
    const buffer = Buffer.from(encryptedBase64, 'base64');
    return safeStorage.decryptString(buffer);
  }
  throw new Error('Encryption is not available on this system');
});