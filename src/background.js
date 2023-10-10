'use strict'


import { app, protocol, BrowserWindow, Menu } from 'electron'
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
import installExtension, { VUEJS_DEVTOOLS } from 'electron-devtools-installer'


const isDevelopment = process.env.NODE_ENV !== 'production'
const { ipcMain, shell } = require('electron')
const path = require('path');
const exec = require('child_process').exec;
const iconv = require('iconv-lite');
var fs = require('fs');
const os = require("os");

Menu.setApplicationMenu(null) //取消菜单栏


function runExec(cmd, option) {
  console.log("exex: " + cmd);
  let workerProcess = exec(cmd, option)
  workerProcess.stdout.on('data', function (data) {
    data = iconv.decode(data, 'gbk');
    console.log('stdout: ' + data)
  })
  workerProcess.stderr.on('data', function (data) {
    data = iconv.decode(data, 'gbk');
    console.log('stderr: ' + data)
  })
  workerProcess.on('close', function (code) {
    console.log('out code: ' + code)
  })
}

function checkGhostscriptLanguage(is64Bit) {
  let appPath = app.getAppPath();
  let chisimTraineddataPath = path.join(appPath, 'dependencies', 'chi_sim.traineddata');
  const sourcePath = chisimTraineddataPath; // 要拷贝的文件路径
  let targetPathTemp = 'C:\\Program Files\\Tesseract-OCR\\tessdata\\chi_sim.traineddata';
  if (!is64Bit) {
    targetPathTemp = 'C:\\Program Files (X86)\\Tesseract-OCR\\tessdata\\chi_sim.traineddata';
  }
  const targetPath = targetPathTemp;
  const sourceData = fs.readFileSync(sourcePath);
  const targetDir = path.dirname(targetPath);
  fs.exists(targetPath, function (exists) {
    if (exists) {
      console.log("Good::Language chi_sim exsited.")
    } else {
      if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
      }
      fs.writeFileSync(targetPath, sourceData);
      console.log("INFO::Language chi_sim copied.")
    }
  })
}

// function installGhostscript() {
//   const is64bit = (os.arch() === "x64" || os.arch() === "arm64");
//   if (is64bit) {
//     console.log("OS::64-bit");
//     fs.exists("C:\\Program Files\\gs\\gs9.56.1\\bin\\gswin64.exe", function (exists) {
//       if (!exists) {
//         console.log("Bad::Ghostscript has not been installed.");
//         let appPath = app.getAppPath();
//         let ghostscriptInstallerPath = path.join(appPath, 'dependencies', 'gs9561w64.exe');
//         console.log("ghostscriptInstallerPath: " + ghostscriptInstallerPath);
//         runExec(ghostscriptInstallerPath + " /S", {});
//         checkGhostscriptLanguage(true);
//       } else {
//         console.log("Good::Ghostscript has been installed.");
//         checkGhostscriptLanguage(true);
//       }
//     });
//   } else {
//     console.log("OS::32-bit OS");
//     fs.exists("C:\\Program Files (x86)\\gs\\gs9.56.1\\bin\\gswin32.exe", function (exists) {
//       if (!exists) {
//         console.log("Bad::Ghostscript has not been installed.");
//         let appPath = app.getAppPath();
//         let ghostscriptInstallerPath = path.join(appPath, 'dependencies', 'gs9561w32.exe');
//         console.log("ghostscriptInstallerPath: " + ghostscriptInstallerPath);
//         runExec(ghostscriptInstallerPath + " /S", {});
//         checkGhostscriptLanguage(false);
//       } else {
//         console.log("Good::Ghostscript has been installed.");
//         checkGhostscriptLanguage(false);
//       }
//     });
//   }
// }


// function installTesseract() {
//   const is64bit = (os.arch() === "x64" || os.arch() === "arm64");
//   if (is64bit) {
//     console.log("OS::64-bit");
//     fs.exists("C:\\Program Files\\Tesseract-OCR\\tesseract.exe", function (exists) {
//       if (!exists) {
//         console.log("Bad::Tesseract has not been installed.");
//         let appPath = app.getAppPath();
//         let tesseractInstallerPath = path.join(appPath, 'dependencies', 't64.exe');
//         console.log("tesseractInstallerPath: " + tesseractInstallerPath);
//         runExec(tesseractInstallerPath + " /S", {});
//       } else {
//         console.log("Good::Tesseract has been installed.");
//       }
//     });
//   } else {
//     console.log("OS::32-bit OS");
//     fs.exists("C:\\Program Files (x86)\\Tesseract-OCR\\tesseract.exe", function (exists) {
//       if (!exists) {
//         console.log("Bad::Tesseract has not been installed.");
//         let appPath = app.getAppPath();
//         let tesseractInstallerPath = path.join(appPath, 'dependencies', 't32.exe');
//         console.log("tesseractInstallerPath: " + tesseractInstallerPath);
//         runExec(tesseractInstallerPath + " /S", {});
//       } else {
//         console.log("Good::Tesseract has been installed.");
//       }
//     });
//   }
// }

// function startServer() {
//   let appPath = app.getAppPath();
//   let managePath = path.join(appPath, 'dependencies', 'manage', 'manage.exe');
//   let runServerEnv = path.join(appPath, 'dependencies', 'manage');
//   console.log("managePath: " + managePath);
//   runExec("for /f \"tokens=5\" %a in ('netstat -aon ^| findstr \":59821\"') do taskkill /f /pid %a");
//   runExec(managePath + " runserver 59821 --noreload", { cwd: runServerEnv });
// }

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } }
])
let win;
async function createWindow() {
  // Create the browser window.
  win = new BrowserWindow({
    width: 930,
    height: 600,
    frame: true,                   // 显示窗口边框
    webPreferences: {
      // Use pluginOptions.nodeIntegration, leave this alone
      // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
      nodeIntegration: true,//process.env.ELECTRON_NODE_INTEGRATION,
      contextIsolation: false//!process.env.ELECTRON_NODE_INTEGRATION
    }
  })

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
    if (!process.env.IS_TEST) win.webContents.openDevTools()
  } else {
    createProtocol('app')
    // Load the index.html when not in development
    win.loadURL('app://./index.html');
  }
}

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    try {
      await installExtension(VUEJS_DEVTOOLS)
    } catch (e) {
      console.error('Vue Devtools failed to install:', e.toString())
    }
  }
  createWindow();
})

ipcMain.on('openFile', (event, file) => {
  shell.openPath(file);
})

ipcMain.on('openFolder', (event, file) => {
  shell.showItemInFolder(file);
})

ipcMain.on('checkEvironment', (event, data) => {
  // installGhostscript();
  // installTesseract();
  // startServer();
  setTimeout(() => {
    win.webContents.send('checkEvironment', 'ok');
    console.log("延时两秒检测环境~");
  }, 2000)
})

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', (data) => {
      if (data === 'graceful-exit') {
        app.quit()
      }
    })
  } else {
    process.on('SIGTERM', () => {
      app.quit()
    })
  }
}
