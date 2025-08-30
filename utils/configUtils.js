const path = require("path");
const fs = require("fs");

const { app } = require("electron");
const { verifyConfig } = require("./fileUtils");
const isDev = !app.isPackaged;
const userData = app.getPath("userData");
const basePath = isDev ? __dirname : process.resourcesPath;


configPath = path.join(userData, "config.json");
verifyConfig(userData);
let config = JSON.parse(fs.readFileSync(configPath, "utf-8"));

function getConfig() {
  try {
    return { success: true, message: config };
  } catch (err) {
    return { success: false, message: err.message };
  }
}
function saveConfig(newConfig) {
  try {
    fs.writeFileSync(configPath, JSON.stringify(newConfig, null, 2), "utf-8");
    config = newConfig;
    return { success: true, message: "Config saved" };
  } catch (err) {
    return { success: false, message: err.message };
  }
}

module.exports = {
  getConfig,
  saveConfig,
};
