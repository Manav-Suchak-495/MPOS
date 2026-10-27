import { app, BrowserWindow, ipcMain, safeStorage } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let mainWindow: BrowserWindow | null = null;

function createWindow(): void {
  mainWindow = new BrowserWindow({
    width: 1080,
    height: 720,
    title: 'Barflow',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      webSecurity: true,
      preload: path.join(__dirname, 'preload.js')
    },
  });

  const url = 'http://localhost:8081';

  // Load Expo Web bundle
  mainWindow.loadURL(url).catch(() => {
    console.log('Retrying connection to Metro server...');
    setTimeout(() => {
      mainWindow?.loadURL(url);
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