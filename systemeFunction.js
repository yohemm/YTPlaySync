const { getConfig } = require("./utils/configUtils");
const {
  getRegistedPlaylistsUrl,
  getRegistedPlaylistName,
  registerPlaylist,
  unregisterPlaylist,
} = require("./utils/fileUtils");
const { downloadWithYtDlp, requestPlaylistName } = require("./utils/ytdlpUtils");

async function navigationToPage(page) {
  const { BrowserWindow } = require("electron");
  const win = BrowserWindow.getFocusedWindow();
  if (win) {
    await win.loadFile(page);
  }
}

async function getSynchedPlaylistInfo() {
  const playlists = getRegistedPlaylistsUrl();
  const infoList = [];
  for (const url of playlists) {
    infoList.push({ name: await getPlaylistName(url), url: url });
  }
  return infoList;
}

async function syncRegistedPlaylists() {
  const playlists = getRegistedPlaylistsUrl();
  res = "\n";
  config = getConfig().message;
  for (const url of (config.reversePlaylistOrder ? playlists?.reverse() : playlists)) {
    try {
      playlistname = await getPlaylistName(url);
      console.log(`Starting download for playlist: ${url}`);
      const message = await downloadWithYtDlp(url, config, playlistname);
      console.log(message);
      res += `${message} : ${getRegistedPlaylistName(url)}\n`;
    } catch (err) {
      console.error(`Error downloading playlist ${url}: ${err.message}`);
    }
  }
  return res;
}

async function getPlaylistName(url) {
  return getRegistedPlaylistName(url) || (await requestPlaylistName(url));
}
async function Init() {
  const { app } = require("electron");
  const isDev = !app.isPackaged;
  const basePath = isDev ? __dirname : process.resourcesPath;


  const path = require("path");
  const fs = require("fs");
  const ytdlpPath = path.join(basePath, "dependances", "yt-dlp.exe");
  if (!fs.existsSync(ytdlpPath)) {
    throw new Error("yt-dlp executable not found at " + ytdlpPath);
  }
  return;
}

async function downloadUrl(url) {
  return downloadWithYtDlp(
    url,
    getConfig().message,
    await getPlaylistName(url)
  );
}

function getRegistedPlaylistsName() {
  const data = getRegistedPlaylistsUrl();
  return Promise.all(data.map((u) => getRegistedPlaylistName(u)));
}

function unregisterSyncPlaylist(url) {
  if (!getRegistedPlaylistsUrl().includes(url)) {
    return { success: false, message: "Playlist not registered" };
  }
  try {
    unregisterPlaylist(url);
    return { success: true, message: `Playlist "${name}" registered` };
  } catch (err) {
    return { success: false, message: err.message };
  }
}
async function registerNewPlaylist(url) {
  if (getRegistedPlaylistsUrl().includes(url)) {
    return { success: false, message: "Playlist already registered" };
  }
  try {
    const name = await requestPlaylistName(url);
    registerPlaylist(url, name);
    return { success: true, message: `Playlist "${name}" registered` };
  } catch (err) {
    return { success: false, message: err.message };
  }
}

async function openFolder(message = "Select download folder", defaultPath = "./") {
  const { dialog } = require("electron");
  res = null;
  const resDialog = await dialog.showOpenDialog({ properties: ['openDirectory', 'createDirectory'], defaultPath: defaultPath, message: message, title: message, buttonLabel: "Select folder" });
  if (!resDialog.canceled && resDialog.filePaths.length > 0) {
    return resDialog.filePaths[0];
  }
  return null;
}

module.exports = {
  getPlaylistName,
  downloadUrl,
  syncRegistedPlaylists,
  getRegistedPlaylistsName,
  registerNewPlaylist,
  getSynchedPlaylistInfo,
  unregisterSyncPlaylist,
  openFolder,
  navigationToPage,
};
