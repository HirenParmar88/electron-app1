import { app, BrowserWindow, globalShortcut, Menu, Tray, ipcMain } from "electron";
import windowStateKeeper from "electron-window-state";

// console.log('Hello, Electron is Running!');

let win;
let tray;

//menu and menu item
let isMac = process.platform === "darwin";
console.log("Running on macOS:", isMac);
let template = [
  ...isMac?{
    label: "File 1",
    submenu: [
      {
        label: "New Window",
      },
      {
        label: "Open File",
      },
    ],
  } : [],
  {
    label: "Edit 1",
  },
  {
    label: "View 1",
  },
];
let menu = new Menu.buildFromTemplate(template);
Menu.setApplicationMenu(menu);

const createWindow = () => {
  let mainWindowState = windowStateKeeper({
    defaultWidth: 800,
    defaultHeight: 600,
  });
  win = new BrowserWindow({
    x: mainWindowState.x,
    y: mainWindowState.y,
    width: mainWindowState.width,
    height: mainWindowState.height,
    webPreferences: {
      nodeIntegration: true,
      menubar: false,
    },
  });

  //web content events
  let wc = win.webContents;
  wc.on("did-finish-load", () => {
    console.log("did-finish-load event fired");
  });
  wc.on("did-fail-load", (event, errorCode, errorDescription, validatedURL) => {
    console.error(
      `Failed to load ${validatedURL}: ${errorDescription} (Error code: ${errorCode})`,
    );
  });
  wc.on("dom-ready", () => {
    console.log("app DOM is ready");
  });
  win.webContents.setWindowOpenHandler((details) => {
    console.log("Window open requested:", details.url);
    const newWin = new BrowserWindow({
      width: 800,
      height: 600,
      webPreferences: {
        nodeIntegration: true,
      },
    });
    newWin.loadURL(details.url);
    return { action: "deny" };
  });

  win.loadFile("index.html");

  //global shortcut
  globalShortcut.register("Shift+K", () => {
    win.loadFile("other.html");
    console.log("Shift + K is pressed");
  });

  //Tray
  tray = new Tray("iconTray.png");
  tray.setToolTip("Electron Tray Example");
  tray.on("click", () => {
    win.isVisible() ? win.hide() : win.show();
  }); 

  mainWindowState.manage(win);
  win.webContents.openDevTools();
};

// App lifecycle events
// app.on('before-quit', () => {
//   console.log('App is about to quit');
// });

// app.on('will-quit', () => {
//   console.log('App will quit');
// });

// app.on('browser-window-focus', () => {
//   console.log('Browser window is focused');
// });

// app.on('browser-window-blur', () => {
//   console.log('Browser window is blurred ..');
// });

// app.on('ready', () => {
//   console.log('App is ready');
// });

app.whenReady().then(createWindow);
