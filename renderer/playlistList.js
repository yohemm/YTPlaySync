async function updateSyncList() {
  const syncList = document.getElementById("sync-list");
  syncList.innerHTML = ""; // Clear previous items

  const result = await window.electronAPI.getSyncLists();
  if (result.success) {
    result.message.forEach((plInfo) => {
      const li = document.createElement("li");
      const div = document.createElement("div");
      const btn = document.createElement("button");
      const btnDelete = document.createElement("button");
      li.textContent = plInfo.name;
      btn.textContent = "Sync";
      btn.id = "sync-" + plInfo.name.replace(/\s+/g, "-").toLowerCase();
      btnDelete.textContent = "Delete";
      btnDelete.id = "delete-" + plInfo.name.replace(/\s+/g, "-").toLowerCase();

      btn.addEventListener("click", () => {
        justDownload(
          plInfo.url,
          plInfo.name,
          document.getElementById("status-sync")
        );
      });

      btnDelete.addEventListener("click", () => {
        deletePlaylistRegisted(
          plInfo.url,
          document.getElementById("status-sync")
        );
        updateSyncList();
      });
      div.appendChild(btn); // Space between name and button
      div.appendChild(btnDelete); // Space between name and button
      li.appendChild(div);
      syncList.appendChild(li);
    });
  }
}

window.addEventListener("DOMContentLoaded", updateSyncList);
