'use strict'


import { app, protocol, BrowserWindow, Menu } from 'electron'
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
import installExtension, { VUEJS_DEVTOOLS } from 'electron-devtools-installer'
import { setInterval } from 'core-js'


const isDevelopment = process.env.NODE_ENV !== 'production'
const { ipcMain, shell } = require('electron')
const path = require('path');
const exec = require('child_process').exec;
const iconv = require('iconv-lite');
var fs = require('fs');
const os = require("os");

Menu.setApplicationMenu(null) //取消菜单栏

let appPath = app.getAppPath();
const ScanDirectory = path.join(appPath, 'ScanDirectory');

let extractFeatureProcess = null;

// 用于CMD命令执行
function runExecExtractFeature(cmd, option) {
  console.log("exex: " + cmd);
  let workerProcess = exec(cmd, option)
  workerProcess.stdout.on('data', function (data) {
    // console.log('stdout: ' + data);
    win.webContents.send('docker-cmd-stdout', data);
  })
  workerProcess.stderr.on('data', function (data) {
    // console.log('stderr: ' + data);
    win.webContents.send('docker-cmd-stderr', data);
  })
  workerProcess.on('close', function (code) {
    // console.log('out code: ' + code);
    win.webContents.send('docker-cmd-close', code);
    extractFeatureProcess = null;
  })
  return workerProcess;
}

// 用于CMD命令执行
function runExec(cmd, option) {
  console.log("exex: " + cmd);
  let workerProcess = exec(cmd, option)
  workerProcess.stdout.on('data', function (data) {
    win.webContents.send('docker-cmd-stdout', data);
  })
  workerProcess.stderr.on('data', function (data) {
    win.webContents.send('docker-cmd-stderr', data);
  })
  workerProcess.on('close', function (code) {
    win.webContents.send('docker-cmd-close', code);
  })
  return workerProcess;
}

// 要使用Electron获取CSV文件的行数，你可以使用Node.js的fs模块来读取文件，并计算行数。下面是一个示例代码：
function getCsvRowCount(filePath) {
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const lines = fileContent.split('\n');
  return lines.length;
}

// 在 Electron 中，你可以使用 Node.js 的 fs 模块来删除文件和文件夹。要删除 scanDirectory 下的所有文件和文件夹，你可以使用递归的方式来实现。以下是一个示例代码：
function deleteDirectoryRecursive(directoryPath) {
  if (fs.existsSync(directoryPath)) {
    fs.readdirSync(directoryPath).forEach((file) => {
      const curPath = path.join(directoryPath, file);
      if (fs.lstatSync(curPath).isDirectory()) {
        deleteDirectoryRecursive(curPath); // 递归删除子文件夹
      } else {
        fs.unlinkSync(curPath); // 删除文件
      }
    });
  }
}

// 将APK文件复制到APK特征提取的工作目录
function copyAPKFileToScanDirectory(apkFilePath) {
  // 检查目录是否存在
  if (!fs.existsSync(ScanDirectory)) {
    // 创建目录
    fs.mkdirSync(ScanDirectory);
    console.log('ScanDirectory目录已创建');
  } else {
    deleteDirectoryRecursive(ScanDirectory);
    console.log('ScanDirectory目录已存在');
  }
  // 复制文件到工作目录
  let destinationPath = path.join(ScanDirectory, path.basename(apkFilePath));
  fs.copyFileSync(apkFilePath, destinationPath);
  console.log('APK文件已复制: '+destinationPath);
}

//使用CMD提取APK的特征
function extractAPKFeature(){
  let cmdExtractAPKFeature = "docker run --volume="+ScanDirectory+":/apks alexmyg/andropytool -s /apks/ -csv EXPORTCSV -S -fw --no-color";
  extractFeatureProcess = runExecExtractFeature(cmdExtractAPKFeature);
}

// 跑机器学习模型
function judgeAPKWithMachineLearning(){
  let csvPath = path.join(ScanDirectory, "FlowDroid_processed","flowdroid_global.csv");
  let extractInterval = setInterval(()=>{
    fs.exists(csvPath,function(exsited){
      if(exsited && getCsvRowCount(csvPath)>=2 && extractFeatureProcess==null){
        let judgeAPKCMD = "C:\\Users\\fanqi\\Application\\anaconda\\envs\\autodns\\python.exe C:\\Users\\fanqi\\Documents\\GitHub\\AutoDNS\\Code\\AutoDNS\\code\\AutoPrint\\Utils\\APKDetector.py "+csvPath+" C:\\Users\\fanqi\\Documents\\GitHub\\OCRmyPDF-Desktop\\public\\Model\\ag-20231010_054649 benign"
        runExec(judgeAPKCMD);
        clearInterval(extractInterval);
      }else{
        console.log("Waiting for extract freature...");
      }
    })
  },5000)
}

// function checkGhostscriptLanguage(is64Bit) {
//   let appPath = app.getAppPath();
//   let chisimTraineddataPath = path.join(appPath, 'dependencies', 'chi_sim.traineddata');
//   const sourcePath = chisimTraineddataPath; // 要拷贝的文件路径
//   let targetPathTemp = 'C:\\Program Files\\Tesseract-OCR\\tessdata\\chi_sim.traineddata';
//   if (!is64Bit) {
//     targetPathTemp = 'C:\\Program Files (X86)\\Tesseract-OCR\\tessdata\\chi_sim.traineddata';
//   }
//   const targetPath = targetPathTemp;
//   const sourceData = fs.readFileSync(sourcePath);
//   const targetDir = path.dirname(targetPath);
//   fs.exists(targetPath, function (exists) {
//     if (exists) {
//       console.log("Good::Language chi_sim exsited.")
//     } else {
//       if (!fs.existsSync(targetDir)) {
//         fs.mkdirSync(targetDir, { recursive: true });
//       }
//       fs.writeFileSync(targetPath, sourceData);
//       console.log("INFO::Language chi_sim copied.")
//     }
//   })
// }

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
    width: 1076,
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

// 2023/10/10 添加恶意APK的相关函数
ipcMain.on('copyAPKFileToScanDirectory', (event, apkFilePath) => {
  copyAPKFileToScanDirectory(apkFilePath);
  event.returnValue="ok";
})

ipcMain.on('extractAPKFeature', (event) => {
  extractAPKFeature(ScanDirectory);
  event.returnValue="ok";
})

ipcMain.on('judgeAPKWithMachineLearning', (event) => {
  judgeAPKWithMachineLearning();
  event.returnValue="ok";
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
