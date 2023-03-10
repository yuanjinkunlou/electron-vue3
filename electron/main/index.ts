import { app, BrowserWindow } from 'electron'
import path from 'node:path'

let win: BrowserWindow;

app.whenReady().then(() => {
    win = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });

    if (process.argv[2]) {
        win.loadURL(process.argv[2]);
        win.webContents.openDevTools();
    } else {
        win.loadFile(path.join(__dirname, '../index.html'));
    }
})

