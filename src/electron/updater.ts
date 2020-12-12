/**
 * original link: https://github.com/electron-userland/electron-builder/blob/docs/encapsulated%20manual%20update%20via%20menu.js
 * Please use manual update only when it is really required, otherwise please use recommended non-intrusive auto update.
 *
 * This is modified version for me
 *
 * Import steps:
 * 1. create `updater.js` for the code snippet
 * 2. require `updater.js` for menu implementation, and set `checkForUpdates` callback from `updater` for the click property of `Check Updates...` MenuItem.
 */
import { app, BrowserWindow, dialog, MenuItem, MessageBoxReturnValue } from 'electron'
import { autoUpdater, UpdateDownloadedEvent, UpdateInfo } from 'electron-updater'
import { ProgressInfo } from 'builder-util-runtime'

let updater: MenuItem
let parentWindow: BrowserWindow
autoUpdater.autoDownload = false
// set to false. List if `updater.fullChangelog` is set to `true`, `string` otherwise.(include html format)
autoUpdater.fullChangelog = false
// fix bug: electron-updater will update even I don't call quitAndInstall after app quit
// https://github.com/electron-userland/electron-builder/issues/2493
autoUpdater.autoInstallOnAppQuit = false

autoUpdater.on('error', (error: any) => {
  dialog.showErrorBox('更新错误: ', error == null ? 'unknown' : (error.stack && error).toString() || 'unknown')
  updater.enabled = true
})

autoUpdater.on('update-available', (updateInfo: UpdateInfo) => {
  // when enter this callback, use IPC to send info to ModalUpdateAvailable.vue
  if (parentWindow) {
    parentWindow.webContents.send('update-available', updateInfo)
  }
  updater.enabled = true
})

// this event sometimes will NOT emit because of differential download
// https://github.com/electron-userland/electron-builder/issues/2521
autoUpdater.on('download-progress', (progressInfo: ProgressInfo) => {
  // do better: show download progress bar
  // mainWindow.send()...
})

autoUpdater.on('update-not-available', (info: { version: any }) => {
  dialog.showMessageBox({
    title: '检测更新',
    message: `目前版本已是最新版本. 目前版本:${app.getVersion()}. 最新版本:${info.version}`
  })
  updater.enabled = true
})

autoUpdater.on('update-downloaded', (updateDownloadedEvent: UpdateDownloadedEvent) => {
  dialog.showMessageBox({
    type: 'info',
    title: '安装更新',
    message: '更新已下载完毕, 退出并安装, 或暂不安装？',
    buttons: ['退出并安装', '暂不安装'],
    defaultId: 0, // default => install
    cancelId: 1 // close => not install
  }).then((value: MessageBoxReturnValue) => {
    if (value.response === 0) {
      autoUpdater.quitAndInstall()
    }
  })
  updater.enabled = true
})

// export this to MenuItem click callback
export function checkForUpdates (menuItem: MenuItem, focusedWindow: BrowserWindow) {
  updater = menuItem
  parentWindow = focusedWindow
  updater.enabled = false
  autoUpdater.checkForUpdates()
}
