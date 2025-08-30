# Changelog – YT Music Playlist Sync

All notable changes to this project will be documented in this file.

---

## \[1.0.1] – Full Release

**Release Date:** 2025-08-29

**Summary:**
Initial full release of YT Music Playlist Sync with GUI, advanced settings, sync list, CLI support, and full configuration management.

### Features

* **Playlist Sync & Download**

  * Download multiple YouTube playlists efficiently using `yt-dlp`.
  * Sync list management: add/remove playlists to track for automatic downloads.
  * Reverse playlist or music order (advanced settings).

* **Advanced Configuration**

  * Set download folder, archive folder, and logs folder.
  * Choose audio format (`mp3`, `m4a`, `opus`, `wav`).
  * Audio quality selection (Best / Medium / Worst).
  * File renaming pattern support (`%(title)s.%(ext)s`).
  * Enable/disable embedded album art (thumbnails).
  * Enable logging with custom log path.
  * Max simultaneous downloads configurable.

* **CLI Support**

  * Run background sync: `YT-Music-Playlist-Sync.exe background`
  * Download a single playlist: `YT-Music-Playlist-Sync.exe download <playlist_URL>`
  * Add playlist to sync list via CLI: `YT-Music-Playlist-Sync.exe sync append <playlist_URL>`

* **GUI Features**

  * Main page: playlist management and download form.
  * Advanced settings page: toggle advanced options.
  * top-bar menu:

    * File > Sync all playlists, Advanced Options, Exit
    * About Us > Doc, Contribut, Forum, Version info
  * Folder selectors for downloads, archives, and logs.
  * Save & reload configuration from GUI.

* **Architecture & Performance**

  * Built with Electron + Node.js.
  * Uses `yt-dlp` for fastest playlist downloading.
  * Background download and intelligent sync to avoid duplicates.
  * Configuration stored in JSON files (`conf.json`, `playlists.json`).
  * Ensures directories exist before downloading.

### Bug Fixes

* Fixed boolean inputs for advanced settings not saving correctly.
* Fixed reverse order and logging flags in `yt-dlp` arguments.
* Fixed dynamic menu label toggle for advanced settings.

### Internal Improvements

* Modular system functions in `systemeFunction.js`.
* Dedicated utils for `configUtils.js`, `fileUtils.js`, and `ytdlpUtils.js`.
* Proper user-specific paths via `app.getPath("userData")`.
* IPC communication between main and renderer processes.

---

## \[0.3.0] – POC 3

* GUI prototype added.
* Background synchronization implemented.
* Base playlist management via JSON.
* CLI support partially implemented.
* Sync on launch for registered playlists.

---

## \[0.2.0] – POC 2

* Add playlist from GUI.
* Change download root folder via GUI.
* Smart sync with verification.

---

## \[0.1.0] – POC 1

* Basic playlist download functionality.
* Configuration file for playlist URLs and root folders.
* Initial synchronization at startup.
* Open-source, minimal dependencies (Node.js, Electron, yt-dlp).

---

## Notes

* All versions fully cross-platform for Windows (Linux/macOS support planned).
* Current license: **Creative Commons Attribution-NonCommercial 4.0 (CC BY-NC 4.0)**.
* Future roadmap: tray icon for background sync, notifications, playlist sharing.