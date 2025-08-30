const playlistForm = document.getElementById("playlist-form");

playlistForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const status = document.getElementById("status");
  const url = document.getElementById("url").value;

  status.innerHTML = ``;

  if (!url.includes("youtube.com/playlist?list=")) {
    status.textContent += `URL unvalid, must be a Youtube playlist URL\n`;
    return;
  }
  const playlistInfo = await window.electronAPI.getPlaylistName(url);
  if (!playlistInfo.success) {
    status.textContent += `Error: ${playlistInfo.message}\n`;
    return;
  }
  switch (e.submitter.value) {
    case "Just Download":
      await justDownload(url, playlistInfo.message, status);
      break;
    default:
      await appendToSyncQueue(url, playlistInfo.message, status);
      break;
  }
});

async function appendToSyncQueue(url, playlistName, statusTag) {
  window.electronAPI
    .registerPlaylist(url)
    .then((result) => updateSyncList());
  justDownload(url, playlistName, statusTag);
}

async function deletePlaylistRegisted(url, statusTag) {
  const status = document.getElementById("status");

  statusTag.textContent += `Unregistering playlist : ${url}\n`;
  try {
    const result = await window.electronAPI.unregisterPlaylist(url);
    if (result.success) {
      statusTag.textContent += `Success: ${result.message.message}\n`;
    } else {
      statusTag.textContent += `Error: ${result.message}\n`;
    }
  } catch (error) {
    statusTag.textContent += `Unexpected Error: ${error.message}\n`;
  }
}
async function justDownload(url, playlistName, statusTag) {
  statusTag.textContent += `Starting download for ${playlistName} : ${url}\n`;
  try {
    const result = await window.electronAPI.downloadPlaylist(url);
    if (result.success) {
      statusTag.textContent += `Success: ${result.message}\n`;
    } else {
      statusTag.textContent += `Error: ${result.message}\n`;
    }
  } catch (error) {
    statusTag.textContent += `Unexpected Error: ${error.message}\n`;
  }
}
