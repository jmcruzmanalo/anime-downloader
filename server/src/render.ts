import { app, BrowserWindow } from 'electron';
// import * as unhandled from 'electron-unhandled';
import { bootstrap } from './main';

async function createWindow() {
  // unhandled();
  // Create the browser window.
  let win = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 1280,
    minHeight: 800,
  });
  win.setMenu(null);
  win.setMenuBarVisibility(false);

  win.loadURL('https://www.youtube.com/');

  await bootstrap();

  // and load the index.html of the app.
  win.loadURL('http://localhost:5000');
}

app.on('ready', createWindow);
