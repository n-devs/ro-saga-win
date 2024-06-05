const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('node:path');


// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

const createWindow = () => {
  // Create the browser window.

  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    autoHideMenuBar: true,
    frame: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  // and load the index.html of the app.
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`));
  }

  const setupEventListener = (browserWindow, sender) => {
    browserWindow.addListener("maximize", () => {
      sender.send("window-controls/maximunize/change", true, browserWindow.id);
    });
    browserWindow.addListener("unmaximize", () => {
      sender.send("window-controls/maximunize/change", false, browserWindow.id);
    });
  };

  ipcMain.handle("window-controls/initialize", (event, browserWindowId) => {
    const browserWindow = browserWindowId
      ? mainWindow.fromId(browserWindowId)
      : mainWindow.fromWebContents(event.sender);

    if (browserWindow) {
      setupEventListener(browserWindow, event.sender);
      return browserWindow.id;
    }
    return undefined;
  })
  ipcMain.on("window-controls/maximumize/set", (event, browserWindowId) => {
 
    if (mainWindow?.isMaximizable()) {
      if (mainWindow.isMaximized()) {
        mainWindow.unmaximize();
      } else {
        mainWindow.maximize();
      }
    }
  })
  ipcMain.on("window-controls/minimumize/set", (event, browserWindowId) => {
    
      mainWindow.minimize();
  })
  ipcMain.on("window-controls/close", (event, browserWindowId) => {
  console.log(browserWindowId);
      mainWindow.close();
  })


  // Open the DevTools.
  // mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow();

  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});


// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
