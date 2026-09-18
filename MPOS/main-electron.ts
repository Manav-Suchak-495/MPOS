import { app, BrowserWindow } from 'electron';

let mainWindow: BrowserWindow | null = null;

function createWindow(): void {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    title: 'MPOS Desktop',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      webSecurity: true,
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