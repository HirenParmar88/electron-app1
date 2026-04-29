import {app, BrowserWindow} from 'electron';
import windowStateKeeper from 'electron-window-state';

console.log('Hello, Electron is Running!');

let win;
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

  win.loadFile('index.html');
  mainWindowState.manage(win);
  win.webContents.openDevTools();
};

app.on('before-quit', () => {
  console.log('App is about to quit');
});

app.on('will-quit', () => {
  console.log('App will quit');
});

app.on('browser-window-focus', () => {
  console.log('Browser window is focused');
});

app.on('browser-window-blur', () => {
  console.log('Browser window is blurred ..');
});

app.on('ready', () => {
  console.log('App is ready');
});

app.whenReady().then(createWindow);