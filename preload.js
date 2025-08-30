const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  downloadPlaylist: (url) => ipcRenderer.invoke("download-playlist", url),
  getPlaylistName: (url) => ipcRenderer.invoke("get-playlist-name", url),
  syncRegistedPlaylists: () => ipcRenderer.invoke("sync-registed-playlists"),
  getSyncLists: () => ipcRenderer.invoke("get-sync-lists"),
  updateSyncList: () => ipcRenderer.invoke("update-sync-list"),
  registerPlaylist: (url) =>
    ipcRenderer.invoke("register-playlist", url),
  unregisterPlaylist: (url) => ipcRenderer.invoke("unregister-playlist", url),
  getConfig: () => ipcRenderer.invoke("get-config"),
  saveConfig: (newConfig) => ipcRenderer.invoke("save-config", newConfig),
  initConfig: (folderPath) => ipcRenderer.invoke("init-config", folderPath),
  openFolder: (message, defaultPath) => ipcRenderer.invoke("open-folder", message, defaultPath),
});
