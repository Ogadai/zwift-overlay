const { app, BrowserWindow } = require('electron');
const open = require('open');
const fs = require('fs');

const addr = "https://zwiftsecondscreen.azurewebsites.net";

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

const createWindow = () => {
  // Loading window
  let loadingWindow = new BrowserWindow({ x: 500, y: 250, width: 400, height: 300, frame: false, backgroundColor: '#FC6719'})
  loadingWindow.loadURL(`file://${__dirname}/index.html`);

  // Create the browser window.
  mainWindow = new BrowserWindow({ x: 300, y: 100, width: 800, height: 600, show: false, frame: false, transparent: true, alwaysOnTop: true })

  // and load the index.html of the app.
  const riderId = getRiderId()
  mainWindow.loadURL(addr)
  const url = riderId ? `${addr}/login/${riderId}` : addr

console.log(url)
  mainWindow.loadURL(url)
  mainWindow.once('ready-to-show', () => {
    mainWindow.show()
    loadingWindow.close()
  })

  mainWindow.webContents.on('new-window', function (event, url) {
    event.preventDefault();
    open(url);
  });

  // Emitted when the window is closed.
  mainWindow.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });
};

const getRiderId = () => {
  const path = app.getPath('documents') + "/Zwift/cp"
  if (fs.existsSync(path)) {
    const folders = fs.readdirSync(path)
    if (folders) {
      let data = {}
      folders.forEach(f => {
        if (f.indexOf('user') === 0) {
          const userId = parseInt(f.substring(4))
          const stat = fs.statSync(`${path}/${f}`)
          const accessed = Date.parse(stat.atime)

          if (!data.accessed || accessed > data.accessed) {
            data = {
              userId,
              accessed
            }
          }
        }
      })

      if (data.userId) {
        return data.userId
      }
    }
  }
  return null;
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
