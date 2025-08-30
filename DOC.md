
# YT Music Playlist Sync - Technical Documentation

> Technical documentation for developers and advanced users.  
> Includes setup, module overview, CLI & GUI usage, and build instructions.

---

## 1️⃣ Introduction

**YT Music Playlist Sync** allows users to download and synchronize multiple YouTube Music playlists with advanced settings such as order management, logging, audio format, quality, and embedded album art.  
Built with **Electron**, **Node.js**, and **yt-dlp**, it targets casual users while providing CLI and advanced GUI options for power users.

---

## 2️⃣ Project Architecture

### Folder structure

```

yt-music-playlist-sync/
├─ main.js                  # Main Electron process
├─ preload.js               # Exposes API to renderer
├─ systemeFunction.js       # Core system functions (sync, register, download)
├─ utils/
│  ├─ configUtils.js        # Read/write configuration
│  ├─ fileUtils.js          # Playlist file management
│  └─ ytdlpUtils.js         # yt-dlp integration
├─ renderer/                # Frontend scripts
│  ├─ playlistForm.js
│  ├─ playlistList.js
│  ├─ syncForm.js
│  ├─ configForm.js
│  ├─ index.html               # Main GUI
│  ├─ advanced-settings.html   # Advanced settings GUI
│  └─ style.css                # Styles
````

---

## 3️⃣ Module Overview

### `main.js`
- Electron entry point
- Handles CLI arguments (`background`, `download`, `sync`)
- Sets up `BrowserWindow` and application menu
- Manages IPC communication between main and renderer processes

### systemeFunction.js
- Core functions:
  - `syncRegistedPlaylists()` → download all playlists in sync list
  - `downloadUrl(url)` → download a single playlist
  - `registerNewPlaylist(url)` → register new playlist
  - `unregisterSyncPlaylist(url)` → remove playlist from sync list
  - `getSynchedPlaylistInfo()` → returns list of registered playlists and names
  - `navigationToPage(page)` → load a different HTML page
  - `openFolder(message, defaultPath)` → folder selection dialog

### `utils/configUtils.js`
- Reads and writes `config.json`
- Returns config values to both main and renderer processes

### `utils/fileUtils.js`
- Manages `playlist.json`
- Registers/unregisters playlists
- Returns playlist names and URLs

### `utils/ytdlpUtils.js`
- Wraps `yt-dlp` for playlist info and downloads
- Handles:
  - `requestPlaylistInfo(url)` → fetch JSON metadata
  - `requestPlaylistName(url)` → get playlist title
  - `downloadWithYtDlp(url, config, name)` → executes `yt-dlp` with proper flags
- Supports advanced options: audio quality, format, reverse order, embedded thumbnails, logging

### `renderer/` scripts
- Frontend forms for configuration, playlist management, and sync
- Communicates with main process via `preload.js` and IPC

---

## 4️⃣ Dependencies

The project relies on external binaries for media processing and downloads. These **are not included in the repository** due to size constraints.

- **Node.js** (LTS recommended)
- **Electron** (^37.3.1)
- **electron-builder** (^26.0.12)
- **yt-dlp** (bundled in `dependances/yt-dlp.exe`)
- **ffmpeg** (bundled for audio extraction)
- Optional: any npm modules listed in `package.json`



### Required Binaries

1. **yt-dlp** – For downloading YouTube playlists and videos.

   * Official releases: [https://github.com/yt-dlp/yt-dlp/releases](https://github.com/yt-dlp/yt-dlp/releases)
   * Download the appropriate version for your OS (Windows, macOS, Linux).

2. **FFmpeg** – Required for audio extraction, format conversion, and embedding album art.

   * Official releases: [https://ffmpeg.org/download.html](https://ffmpeg.org/download.html)
   * Make sure to download the executable or binaries and place them in the expected folder.

### Installation / Setup

1. Create a folder `dependances/` in the project root.
2. Place `yt-dlp.exe` (or binary for your OS) inside `dependances/`.
3. Place `ffmpeg` binaries inside `dependances/ffmpeg/`.

   * For Windows: `dependances/ffmpeg/bin/ffmpeg.exe`
<!-- * For Linux/macOS: update your `PATH` or place the executable in the folder accordingly. -->

> ⚠️ **Note:** These binaries are intentionally excluded from the repository (`dependances/` is ignored in `.gitignore`).
> You can optionally provide a post-install script to automatically download these dependencies if desired.


---

## 5️⃣ Clone & Setup

```bash
git clone https://github.com/YOUR_NAME/yt-music-playlist-sync.git
cd yt-music-playlist-sync
npm install
````

---

## 6️⃣ Development

* Start Electron in dev mode:

```bash
npm run start
```

* This will launch the GUI with full console logging

---

## 7️⃣ Build Executable

* Using `electron-builder`:

```bash
npm run dist
```

* Output folder: `/dist`
* Configuration in `package.json > build`:

  * Windows NSIS installer
  * Icon: `renderer/src/logo.ico`
  * Extra resources: `dependances/yt-dlp.exe`, `ffmpeg` binaries

---

## 8️⃣ Configuration (`config.json`)

```json
{
  "downloadsPath": "D:\\yt-music-playlist-sync\\downloads",
  "archivesPath": "D:\\yt-music-playlist-sync\\archives",
  "audioFormat": "mp3",
  "fileName": "%(title)s.%(ext)s",
  "audioQuality": "0",
  "reverseMusicOrder": false,
  "reversePlaylistOrder": false,
  "enableLogging": false,
  "logsPath": "D:\\yt-music-playlist-sync\\logs",
  "maxSimultaneousDownloads": 3,
  "enablePicture": false
}
```

* All keys are editable via GUI or manually
* Advanced settings include: `reverseMusicOrder`, `reversePlaylistOrder`, `enableLogging`, `maxSimultaneousDownloads`, `enablePicture`

---

## 9️⃣ Usage

### GUI

* Launch executable
* Add playlists via form
* Configure download path, quality, audio format, file naming
* Sync playlists manually or via background mode

### CLI

```bash
# Run sync in background
YT-Music-Playlist-Sync.exe background

# Download single playlist
YT-Music-Playlist-Sync.exe download <playlist_URL>

# Add playlist via CLI
YT-Music-Playlist-Sync.exe sync append <playlist_URL>
```

---

## 🔟 IPC / Renderer API

Available functions via `preload.js`:

* `getConfig()`
* `saveConfig(config)`
* `DownloadUrl(url)`
* `registerNewPlaylist(url)`
* `unregisterPlaylist(url)`
* `syncRegistedPlaylists()`
* `getSyncLists()`
* `openFolder(message, defaultPath)`

---

## 1️⃣1️⃣ Future Improvements / Roadmap

* Tray icon for background sync
* Notification system for completed downloads
* Playlist sharing
* More detailed logging and error reporting
* Cross-platform packaging (Linux/macOS)

---

```

This DOC.md now:

- Explains the **architecture**  
- Shows **module responsibilities**  
- Gives **setup, dev, build, and CLI instructions**  
- Explains **configuration** and **IPC API**  

---

If you want, I can **also create a short visual diagram** for the **flow between renderer → preload → main → yt-dlp**, which will make the DOC.md even more professional.  

Do you want me to add that diagram next?
```
