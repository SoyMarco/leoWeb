const electron = require("electron");
const { ipcMain, shell } = require("electron");
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const fs = require("fs");
const os = require("os");
const path = require("path");
const isDev = require("electron-is-dev");

let mainWindow;
let workerWindow;

function createWindow() {
	mainWindow = new BrowserWindow({ show: false });
	mainWindow.maximize();
	mainWindow.show();
	mainWindow.loadURL(
		isDev
			? "http://localhost:3000"
			: `file://${path.join(__dirname, "../build/index.html")}`
	);

	if (isDev) {
		// Open the DevTools.
		//BrowserWindow.addDevToolsExtension('<location to your react chrome extension>');
		mainWindow.webContents.openDevTools();
	}

	mainWindow.on("closed", () => (mainWindow = null));

	workerWindow = new BrowserWindow();
	workerWindow.loadURL(
		isDev
			? "http://localhost:3000"
			: `file://${path.join(__dirname, "../build/index.html")}`
	);
	// workerWindow.hide();
	workerWindow.webContents.openDevTools();
	workerWindow.on("closed", () => {
		workerWindow = undefined;
	});
}

app.on("ready", createWindow);

app.on("window-all-closed", () => {
	if (process.platform !== "darwin") {
		app.quit();
	}
});

app.on("activate", () => {
	if (mainWindow === null) {
		createWindow();
	}
});
// retransmit it to workerWindow
ipcMain.on("print", (event, content) => {
	workerWindow.webContents.send("print", content);
});

ipcMain.on("readyToPrint", (event) => {
	workerWindow.webContents.print({});
});
