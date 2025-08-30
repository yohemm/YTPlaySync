const path = require("path");
const fs = require("fs");
const { spawn } = require("child_process");
const { verifyPath } = require("./fileUtils");
const { app } = require("electron");
const isDev = !app.isPackaged;
const userData = app.getPath("userData");
const basePath = isDev ? __dirname.substring(0, __dirname.lastIndexOf('/')) : process.resourcesPath;

const ytdlpPath = path.join(basePath, "dependances", "yt-dlp.exe");

async function requestPlaylistInfo(url) {
  return new Promise((resolve, reject) => {
    const yt = spawn(ytdlpPath, ["--flat-playlist", "--dump-single-json", url]);
    let dataBuffer = "";
    yt.stdout.on("data", (data) => {
      dataBuffer += data.toString();
    });
    yt.stderr.on("data", (data) => console.error(data.toString()));
    yt.on("close", (code) => {
      if (code === 0) {
        try {
          const playlistInfo = JSON.parse(dataBuffer);
          resolve(playlistInfo);
        } catch (err) {
          reject(new Error("Failed to parse playlist info"));
        }
      } else {
        reject(new Error(`yt-dlp exited with code ${code}`));
      }
    });
  });
}

async function requestPlaylistName(url) {
  const info = await requestPlaylistInfo(url);
  if (!info || !info.title) {
    throw new Error(`Could not fetch playlist name for URL: ${url}`);
  }
  return info.title;
}
async function requestPlaylistLength(url) {
  const info = await requestPlaylistInfo(url);
  if (!info || !info.entries.length) {
    throw new Error(`Could not fetch playlist name for URL: ${url}`);
  }
  return info.entries.length;
}

async function downloadWithYtDlp(url, config, name) {
  console.log("downloadWithYtDlp called with:", { url, config, name });
  if (!name) {
    throw new Error(`Playlist name is undefined for URL: ${url}`);
  }
  const downloadsPath = path.join(
    config.downloadsPath,
    name.replace(/[<>:"\/\\|?*]+/g, "")
  );
  verifyPath(downloadsPath);
  if (config.enableLogs) verifyPath(config.logsPath);
  verifyPath(config.archivesPath);


  console.log("Downloading to:", downloadsPath);
  return new Promise((resolve, reject) => {
    args = [
      "-x",
      "--audio-format",
      config.audioFormat,
      "-o",
      path.join(downloadsPath, config.fileName),
      "--ffmpeg-location",
      path.join(basePath, "dependances", "ffmpeg", "bin", "ffmpeg.exe"),
      "--no-mtime",
      "--no-progress",
      "--audio-quality",
      config.audioQuality,
      "--add-metadata",
      "-N",
      config.maxSimultaneousDownloads,
      "--download-archive",
      path.join(config.archivesPath, name + ".txt"),
    ]
    if (config.enablePicture) args.push("--embed-thumbnail");
    if (config.reverseMusicOrder) args.push("--playlist-reverse");
    const logFile = path.join(config.logsPath, name + '.log');
    const logStream = fs.createWriteStream(logFile, { flags: 'a' });
    if (config.enableLogs) {
      logStream.write("\n" + new Date().toLocaleString + " : Start of process \n");
    }

    args.push(url);
    const yt = spawn(ytdlpPath, args);
    yt.stdout.on("data", (data) => {
      console.log(data.toString());
      if (config.enableLogs) logStream.write(data.toString())
    });
    yt.stderr.on("data", (data) => { console.error(data.toString()); if (config.enableLogs) logStream.write(data.toString()) });
    yt.on("close", (code) => {
      if (code === 0) {
        if (config.enableLogs) {
          logStream.write("\nDownload completed successfully ✅\n");
        }
        logStream.end();
        resolve("Download complete ✅");
      } else {
        if (config.enableLogs) {
          logStream.write(`\nyt-dlp exited with code ${code}\n`);
        }
        logStream.end();
        reject(new Error(`yt-dlp exited with code ${code}`));
      }
    });
  });
}

module.exports = {
  requestPlaylistInfo,
  requestPlaylistName,
  requestPlaylistLength,
  downloadWithYtDlp,
};
