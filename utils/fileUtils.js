const path = require("path");
const fs = require("fs");

const { app } = require("electron");
const isDev = !app.isPackaged;

const userData = app.getPath("userData");
const basePath = isDev ? __dirname : process.resourcesPath;

function getDefaultConfig() {
  return {
    downloadsPath: path.join(userData, "downloads"),
    archivesPath: path.join(userData, "archives"),
    audioFormat: "mp3",
    fileName: "%(title)s.%(ext)s",
    audioQuality: "0",
    enablePicture: true,
    reverseMusicOrder: false,
    reversePlaylistOrder: false,
    enableLogs: false,
    logsPath: path.join(userData, "logs"),
    maxSimultaneousDownloads: 3
  }
}

const jsonPath = path.join(userData, "playlists.json");

function registerPlaylist(url, name) {
  let data = [];

  // 1. Read file if it exists
  if (fs.existsSync(jsonPath)) {
    const fileContent = fs.readFileSync(jsonPath, "utf-8");
    try {
      data = JSON.parse(fileContent);
    } catch (err) {
      console.error("Invalid JSON, resetting file");
      data = [];
    }
  }
  // 2. Append new item
  if (!getRegistedPlaylistsUrl().includes(url)) data.push({ url: url, name: name });

  // 3. Save back to file
  fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2), "utf-8");
}

function verifyPath(p) {
  if (!fs.existsSync(p)) {
    fs.mkdirSync(p, { recursive: true });
  }
}

function unregisterPlaylist(url) {
  let data = [];

  // 1. Read file if it exists
  if (fs.existsSync(jsonPath)) {
    const fileContent = fs.readFileSync(jsonPath, "utf-8");
    try {
      data = JSON.parse(fileContent);
    } catch (err) {
      console.error("Invalid JSON, resetting file");
      data = [];
    }
  }
  // 2. Append new item
  for (let i = 0; i < data.length; i++) {
    if (data[i].url === url) {
      data.splice(i, 1);
      break;
    }
  }
  // 3. Save back to file
  fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2), "utf-8");
}
async function initConfig(folderPath) {
  try {
    verifyPath(folderPath)
    const configPath = path.join(folderPath, "config.json");
    const tempConfig = getDefaultConfig();
    tempConfig.downloadsPath = path.join(folderPath, "downloads");
    tempConfig.archivesPath = path.join(folderPath, "archives");
    tempConfig.logsPath = path.join(folderPath, "logs");
    fs.writeFileSync(configPath, JSON.stringify(tempConfig, null, 2), "utf-8");
    verifyPath(path.join(tempConfig.downloadsPath));
    verifyPath(path.join(tempConfig.archivesPath));
    verifyPath(path.join(tempConfig.logsPath));
    return { success: true, message: "Config initialized" };
  } catch (err) {
    return { success: false, message: err.message };
  }
}

function verifyConfig(folderPath) {
  verifyPath(folderPath);
  const configPath = path.join(folderPath, "config.json");
  if (!fs.existsSync(configPath)) {
    return initConfig(folderPath);
  }
}

function getRegistedPlaylistsData() {
  let data = [];

  // 1. Read file if it exists
  if (fs.existsSync(jsonPath)) {
    const fileContent = fs.readFileSync(jsonPath, "utf-8");
    try {
      data = JSON.parse(fileContent);
    } catch (err) {
      console.error("Invalid JSON, resetting file");
      data = [];
    }
  }
  return data;
}

function getRegistedPlaylistName(url) {
  let data = getRegistedPlaylistsData();
  data = data.find((u) => u.url === url)?.name || null;
  return data;
}
function getRegistedPlaylistsUrl() {
  let data = getRegistedPlaylistsData();
  data = data.map((u) => u.url);
  return data;
}

module.exports = {
  registerPlaylist,
  unregisterPlaylist,
  getRegistedPlaylistsData,
  getRegistedPlaylistsUrl,
  getRegistedPlaylistName,
  initConfig,
  verifyConfig,
  verifyPath
};
