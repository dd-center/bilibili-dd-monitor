import { app, BrowserWindow, Menu } from "electron";
import path from "path";
import { createProtocol } from "vue-cli-plugin-electron-builder/lib";
import { PlayerObj } from "@/interfaces";
import { createMainWindowMenu } from "@/electron/mainWindowMenu";
import ContextMap from "@/electron/utils/ContextMap";

export const createMainWindow = async (app: Electron.App, playerObjMap: ContextMap<number, PlayerObj>) => {
  // Create the browser window.
  const win = new BrowserWindow({
    width: 1250,
    height: 850,
    maximizable: false,
    fullscreen: false,
    fullscreenable: false,
    resizable: false,
    icon: 'public/favicon.ico',
    title: 'bilibili-dd-monitor',
    webPreferences: {
      // Use pluginOptions.nodeIntegration, leave this alone
      // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
      nodeIntegration: (process.env.ELECTRON_NODE_INTEGRATION as unknown) as boolean,
      preload: path.join(__dirname, 'preload.js')
    }
  })

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL as string)
    if (!process.env.IS_TEST) win.webContents.openDevTools()
  } else {
    createProtocol('app')
    // Load the index.html when not in development
    await win.loadURL('app://./index.html')
  }

  // menu
  const menu = createMainWindowMenu(app, playerObjMap);
  if (process.platform === 'darwin') {
    Menu.setApplicationMenu(menu);
  } else {
    win.setMenu(menu);
  }

  playerObjMap.attachContext(win)

  // close event
  win.on('close', () => {

  })

  return win
}
