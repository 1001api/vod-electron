const windowStateManager = require('electron-window-state');
const { app, BrowserWindow, ipcMain } = require('electron');
const serve = require('electron-serve');
const path = require('path');

try {
    require('electron-reloader')(module);
} catch (e) {
    console.error(e);
}

const serverURL = serve.default({ directory: path.join(__dirname, '../dist') });

const port = process.env.PORT || 5173;
const dev = !app.isPackaged;

let mainWindow;

function createWindow() {
    let windowState = windowStateManager({
        defaultWidth: 800,
        defaultHeight: 600,
    });

    const mainWindow = new BrowserWindow({
        backgroundColor: '#0f172a',
        minHeight: 450,
        minWidth: 500,
        show: false,
        autoHideMenuBar: true,
        accentColor: '#020617',
        titleBarStyle: 'hiddenInset',
        icon: path.join(__dirname, 'assets', 'min.png'),
        webPreferences: {
            webSecurity: false,
            contextIsolation: true,
            nodeIntegration: false,
            spellcheck: false,
            devTools: dev,
            preload: path.join(__dirname, 'preload.cjs'),
        },
        x: windowState.x,
        y: windowState.y,
        width: windowState.width,
        height: windowState.height,
    });

    windowState.manage(mainWindow);

    mainWindow.once('ready-to-show', () => {
        mainWindow.show();
        mainWindow.focus();
    });

    mainWindow.on('close', () => {
        windowState.saveState(mainWindow);
    });

    if (dev) {
        mainWindow.loadURL(`http://localhost:${port}`);
    } else {
        serverURL(mainWindow);
    }

    return mainWindow;
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});