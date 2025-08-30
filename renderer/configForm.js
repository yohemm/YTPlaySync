const configForm = document.getElementById("config-form");
const configStatus = document.getElementById("config-status");

async function loadConfig() {
  const result = await window.electronAPI.getConfig();
  if (result.success) {
    const config = result.message;

    const maxSimultaneousDownloads = document.getElementById("maxSimultaneousDownloads");
    const enablePicture = document.getElementById("enablePicture");
    const reverseMusicOrder = document.getElementById("reverseMusicOrder");
    const reversePlaylistOrder = document.getElementById("reversePlaylistOrder");
    const enableLogs = document.getElementById("enableLogging");
    const logsPath = document.getElementById("logsPath");
    const archivesPath = document.getElementById("archivesPath");

    if (maxSimultaneousDownloads) maxSimultaneousDownloads.value = config.maxSimultaneousDownloads;
    if (enablePicture) enablePicture.checked = config.enablePicture;
    if (reverseMusicOrder) reverseMusicOrder.checked = config.reverseMusicOrder;
    if (reversePlaylistOrder) reversePlaylistOrder.checked = config.reversePlaylistOrder;
    if (enableLogs) enableLogs.checked = config.enableLogs;

    if (logsPath) {
      logsPath.value = config.logsPath;
      logsPath.addEventListener("click", async () => {
        const folder = await window.electronAPI.openFolder("Select logs folder", logsPath.value);
        if (folder.success) {
          logsPath.value = folder.message;
        }
      });
    }
    if (archivesPath) {
      archivesPath.value = config.archivesPath;
      archivesPath.addEventListener("click", async () => {
        const folder = await window.electronAPI.openFolder("Select archives folder", archivesPath.value);
        if (folder.success) {
          archivesPath.value = folder.message;
        }
      });
    }


    const downloadsPath = document.getElementById("downloadsPath");
    downloadsPath.value = config.downloadsPath;
    downloadsPath.addEventListener("click", async () => {
      const folder = await window.electronAPI.openFolder("Select downloads folder", downloadsPath.value);
      if (folder.success) {
        downloadsPath.value = folder.message;
      }
    });

    document.getElementById("audioFormat").value = config.audioFormat;
    document.getElementById("fileName").value = config.fileName;
    document.getElementById("audioQuality").value = config.audioQuality;
  } else {
    configStatus.textContent = "Error loading config: " + result.message;
  }
}
window.addEventListener("DOMContentLoaded", loadConfig);
// Save config
configForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const confInfo = await window.electronAPI.getConfig();
  if (!confInfo.success) {
    configStatus.textContent = "Error loading config: " + result.message;
    return;
  }
  const config = confInfo.message;

  const maxSimultaneousDownloads = document.getElementById("maxSimultaneousDownloads");
  const enablePicture = document.getElementById("enablePicture");
  const reverseMusicOrder = document.getElementById("reverseMusicOrder");
  const reversePlaylistOrder = document.getElementById("reversePlaylistOrder");
  const enableLogs = document.getElementById("enableLogging");
  const logsPath = document.getElementById("logsPath");
  const archivesPath = document.getElementById("archivesPath");

  config.downloadsPath = document.getElementById("downloadsPath").value;
  config.audioFormat = document.getElementById("audioFormat").value;
  config.fileName = document.getElementById("fileName").value;
  config.audioQuality = document.getElementById("audioQuality").value;
  if (maxSimultaneousDownloads) config.maxSimultaneousDownloads = parseInt(maxSimultaneousDownloads.value);
  if (enablePicture) config.enablePicture = enablePicture.checked;
  if (reverseMusicOrder) config.reverseMusicOrder = reverseMusicOrder.checked;
  if (reversePlaylistOrder) config.reversePlaylistOrder = reversePlaylistOrder.checked
  if (enableLogs) config.enableLogs = enableLogs.checked;
  if (logsPath) config.logsPath = logsPath.value;
  if (archivesPath) config.archivesPath = archivesPath.value;


  const result = await window.electronAPI.saveConfig(config);
  if (result.success) {
    await loadConfig();
    configStatus.textContent = "Config saved successfully!";
  } else {
    configStatus.textContent = "Error saving config: " + result.message;
  }
});
