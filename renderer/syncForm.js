const sync = document.getElementById("sync-btn");
const statusSync = document.getElementById("status-sync");
sync.addEventListener("click", async (e) => {
  e.preventDefault();
  statusSync.innerHTML = "";
  statusSync.textContent += `Starting synchronization of registed playlists\n`;
  try {
    const result = await window.electronAPI.syncRegistedPlaylists();
    if (result.success) {
      statusSync.textContent += `Success: ${result.message}\n`;
    } else {
      statusSync.textContent += `Error: ${result.message} \n`;
    }
  } catch (error) {
    statusSync.textContent += `Unexpected Error: ${error.message} \n`;
  }
});
