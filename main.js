// console.log('Hello from Electron 👋')
const { app, BrowserWindow, ipcMain, Menu } = require("electron");
const path = require("path");

const {
  downloadUrl,
  getPlaylistName,
  syncRegistedPlaylists,
  getRegistedPlaylistsName,
  registerNewPlaylist,
  getSynchedPlaylistInfo,
  unregisterSyncPlaylist,
  openFolder,
  navigationToPage,
} = require("./systemeFunction");

const { getConfig, saveConfig } = require("./utils/configUtils");
const { initConfig, verifyConfig } = require("./utils/fileUtils");


const isDev = !app.isPackaged;
const userData = app.getPath("userData");
// const basePath = isDev ? __dirname : userData;
const basePath = isDev ? __dirname : process.resourcesPath;
verifyConfig(userData);

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    icon: path.join(__dirname, "renderer", "src", "logo.ico"),
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });
  win.loadFile("./renderer/index.html");
};
app.whenReady().then(() => {
  const args = process.argv.slice(2); // remove electron path
  switch (args[0]) {
    case "init":
      if (args[1]) {
        console.log(initConfig(args[1]));
        app.quit();
      } else {
        console.log(initConfig("./"));
        app.quit();
      }
      break;
    case "sync":
      switch (args[1]) {
        case "background":
          setInterval(async () => {
            try {
              await syncRegistedPlaylists();
              console.log(
                "Sync completed successfully. Next sync in 6 minutes."
              );
            } catch (err) {
              console.error("Sync failed:", err);
            }
          }, 120 * 60000);
          break;
        case "add":
        case "append":
          if (args[2]) {
            registerNewPlaylist(args[2]).then((result) => {
              console.log(result.message);
              if (result.success) {
                syncRegistedPlaylists().then((message) => {
                  console.log(message);
                  app.quit();
                });
              } else {
                app.quit();
              }
            });
          } else {
            console.log("Error: No playlist URL provided.");
          }
          break;
        default:
          syncRegistedPlaylists().then((message) => {
            console.log(message);
            app.quit();
          });
          break;
      }
      break;
    case "download":
      if (args[1]) {
        downloadUrl(args[1]).then((message) => {
          console.log(message);
          app.quit();
        });
      }
      break;
    default:
      createWindow();
      break;
  }
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin" && process.argv[2] !== "background")
    app.quit();
});

let page = "index.html";

function buildMenu() {
  const path = require("path");
  const template = [
    {
      label: "File",
      submenu: [
        {
          label: 'Sync all registed playlists',
          click() {
            syncRegistedPlaylists().then((message) => {
              console.log(message);
            });
          },
          accelerator: 'CmdOrCtrl+R'
        },
        // { type: "separator" },
        {
          label: page === "index.html" ? "Advanced Options" : "Normal View",
          click() {
            if (page === 'index.html') {
              navigationToPage('./renderer/advanced-settings.html');
              page = 'advanced-settings.html';
            }
            else {
              navigationToPage('./renderer/index.html');
              page = 'index.html';
            }
            Menu.setApplicationMenu(buildMenu());
          },
          accelerator: 'CmdOrCtrl+Shift+A'
        },
        { type: "separator" },
        {
          label: 'Exit',
          click() {
            app.quit();
          },
          accelerator: 'CmdOrCtrl+Q'
        },
      ],
    },
    {
      label: "About Us", submenu: [
        {
          label: "Documentation (GitHub)",
          click() { require('electron').shell.openExternal('https://github.com/yohemm/YTPlaySync/blob/master/DOC.md') },
          accelerator: 'CmdOrCtrl+D'
        },
        {
          label: "Contribut (GitHub)",
          click() { require('electron').shell.openExternal('https://github.com/yohemm/YTPlaySync') },
          accelerator: 'CmdOrCtrl+Shift+C'
        },
        {
          label: "Forum (GitHub)",
          click() { require('electron').shell.openExternal('https://github.com/yohemm/YTPlaySync/discussions') },
          accelerator: 'CmdOrCtrl+F'
        },
        { type: "separator" },
        {
          label: "Version 1.0.0",
          enabled: false,
          // accelerator: 'CmdOrCtrl+I'
        }
      ]
    },
  ];
  return Menu.buildFromTemplate(template);
}

Menu.setApplicationMenu(buildMenu());

ipcMain.handle("download-playlist", async (event, url) => {
  try {
    const result = await downloadUrl(url);
    return { success: true, message: result };
  } catch (err) {
    return { success: false, message: err.message };
  }
});
ipcMain.handle("get-playlist-name", async (event, url) => {
  try {
    const result = await getPlaylistName(url);
    return { success: true, message: result };
  } catch (err) {
    return { success: false, message: err.message };
  }
});
ipcMain.handle("sync-registed-playlists", async (event) => {
  try {
    const result = await syncRegistedPlaylists();
    return { success: true, message: result };
  } catch (err) {
    return { success: false, message: err.message };
  }
});

ipcMain.handle("get-sync-lists", async (event) => {
  try {
    const playlistNames = await getSynchedPlaylistInfo();
    return { success: true, message: playlistNames };
  } catch (err) {
    return { success: false, message: err.message };
  }
});
ipcMain.handle("update-sync-list", (event) => {
  return getRegistedPlaylistsName();
});
ipcMain.handle("register-playlist", async (event, url) => {
  try {
    const result = await registerNewPlaylist(url);
    return { success: true, message: result };
  } catch (err) {
    return { success: false, message: err.message };
  }
});
ipcMain.handle("unregister-playlist", (event, url) => {
  try {
    const result = unregisterSyncPlaylist(url);
    return { success: true, message: result };
  } catch (err) {
    return { success: false, message: err.message };
  }
});
ipcMain.handle("get-config", (event) => {
  return getConfig();
});
ipcMain.handle("save-config", (event, newConfig) => {
  return saveConfig(newConfig);
});
ipcMain.handle("init-config", async (event, folderPath) => {
  return await initConfig(folderPath);
});

ipcMain.handle("open-folder", async (event, message, defaultPath) => {
  const folder = await openFolder(message, defaultPath);
  if (folder) {
    return { success: true, message: folder };
  } else {
    return { success: false, message: "No folder selected" };
  }
});