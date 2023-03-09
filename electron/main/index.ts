import { app, BrowserWindow } from 'electron'

let win: BrowserWindow;

app.whenReady().then(() => {
    win = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });
    win.loadURL(process.argv[2]);
    win.webContents.openDevTools();
})

