const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  encryptToken: (token) => ipcRenderer.invoke('encrypt-token', token),
  decryptToken: (encryptedBase64) => ipcRenderer.invoke('decrypt-token', encryptedBase64),
});