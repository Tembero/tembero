const {app, BrowserWindow} = require('electron')
const ipc = require("electron").ipcMain;

let mainWindow, launcher;

function createWindow () {
  mainWindow = new BrowserWindow({
    width: 1920,
    height: 1080,
    webPreferences: {
      nodeIntegration: true
    },
    title: "VectorFrame",
    center: true,
    minHeight: 930,
    minWidth: 1060,
    frame: false,
    show: false,
    icon: __dirname + "/assets/icons/png/icon.png"
  })
  launcher = new BrowserWindow({
    width: 600,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    },
    center: true,
    frame: false,
    resizable: false,
    transparent: true,
    icon: __dirname + "/assets/icons/png/icon.png"
  })

  mainWindow.loadFile('index.html');
  ipc.on("launch", function(){
    mainWindow.show();
  })
  ipc.on("close", function(){
    mainWindow.close();
  })
  launcher.loadFile('launcher.html');

  mainWindow.on('closed', function () {
    mainWindow = null
  })
}

ipc.on("update", function(){
  createWindow();
})


app.on('ready', createWindow)

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow()
  }
})
