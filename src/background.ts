'use strict'

import { app, protocol, BrowserWindow, ipcMain } from 'electron'
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
import installExtension, { VUEJS_DEVTOOLS } from 'electron-devtools-installer'
import path from 'path'
import settings from 'electron-settings'

import { FollowListService, SettingService, VtbInfoService } from '@/electron/services'
import { PlayerObj, VtbInfo } from '@/interfaces'
import { createPlayerWindow } from '@/electron/playerWindow'

let vtbInfosService: VtbInfoService
let mainWindow: BrowserWindow
const playerObjMap = new Map<number, PlayerObj>()
const isDevelopment = process.env.NODE_ENV !== 'production'

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } }
])

async function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({
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
      nodeIntegration: (process.env
        .ELECTRON_NODE_INTEGRATION as unknown) as boolean,
      preload: path.join(__dirname, 'preload.js')
    }
  })

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    await mainWindow.loadURL(process.env.WEBPACK_DEV_SERVER_URL as string)
    // await win.loadURL('https://www.bilibili.com/blackboard/live/live-activity-player.html?enterTheRoom=0&cid=21396545')

    if (!process.env.IS_TEST) mainWindow.webContents.openDevTools()
  } else {
    createProtocol('app')
    // Load the index.html when not in development
    await mainWindow.loadURL('app://./index.html')
  }

  mainWindow.on('close', () => {
    // clean up vtbInfo service
    if (vtbInfosService) vtbInfosService.stopUpdate()

    // clean up playerObjMap
    playerObjMap.forEach((playerObj: PlayerObj) => {
      if (playerObj.playerWindow) playerObj.playerWindow.close()
    })
    playerObjMap.clear()

    // exit app
    app.quit()
  })

  return mainWindow
}

const initUpdate = () => {
  console.log('initUpdate')
}

const initSettingsConfiguration = () => {
  console.log('initSettingsConfiguration')
  settings.configure({
    numSpaces: 2,
    prettify: true
  })
}

const initServices = () => {
  console.log('initServices')

  // init socket.io
  vtbInfosService = new VtbInfoService()

  // init follow setting
  FollowListService.initFollowListsSync()

  // register live change notifications
  // 上次记录的vtbs（已经处理上播和下播提醒）
  let lastLiveVtbs: number[] = []
  vtbInfosService.onUpdate((vtbInfos) => {
    if (mainWindow) {
      mainWindow.webContents.send('updateVtbInfos', vtbInfosService.getFollowedVtbInfos())

      const followVtbs = FollowListService.getFollowedVtbMidsSync()
      // 现在正在直播的vtbs
      const nowLiveFollowedVtbs =
        vtbInfos
          .filter((vtbInfo: VtbInfo) => (followVtbs.includes(vtbInfo.mid) && vtbInfo.liveStatus === 1))
          .map((vtbInfo: VtbInfo) => vtbInfo.mid)
      console.log(`nowLiveFollowedVtbs: ${nowLiveFollowedVtbs.length}`)

      // 上播vtbs
      const upLiveFollowedVtbs: number[] = []
      // 下播vtbs
      const downLiveFollowedVtbs: number[] = []

      // 对于lastLiveVtbs，使用【现在正在直播的vtbs】更新【上播vtbs】
      nowLiveFollowedVtbs.forEach(nowLiveFollowedVtb => {
        if (!lastLiveVtbs.includes(nowLiveFollowedVtb)) {
          upLiveFollowedVtbs.push(nowLiveFollowedVtb)
        }
      })

      // 对于lastLiveVtbs，使用【现在正在直播的vtbs】更新【下播vtbs】
      lastLiveVtbs.forEach(lastLiveVtb => {
        if (!nowLiveFollowedVtbs.includes(lastLiveVtb)) {
          downLiveFollowedVtbs.push(lastLiveVtb)
        }
      })

      console.log(`upLiveFollowedVtbs: ${upLiveFollowedVtbs.length}`)
      console.log(`downLiveFollowedVtbs: ${downLiveFollowedVtbs.length}`)

      // 当前记录的vtbs数量不为0，或者设置启动时接受通知为true。派发上播和下播提醒。
      // optimize：使用debounce避免某个时刻通知过多而导致疯狂弹窗。
      if ((lastLiveVtbs.length !== 0) || SettingService.getIsNotifiedOnStartSync()) {
        upLiveFollowedVtbs.forEach((mid: number) => {
          mainWindow.webContents.send('liveNotice', vtbInfos.find((vtbInfo: VtbInfo) => vtbInfo.mid === mid), '上播提醒')
        })
        downLiveFollowedVtbs.forEach((mid: number) => {
          mainWindow.webContents.send('liveNotice', vtbInfos.find((vtbInfo: VtbInfo) => vtbInfo.mid === mid), '下播提醒')
        })
      }

      // 将当前直播vtbs记录赋值为lastLiveVtbs
      lastLiveVtbs = nowLiveFollowedVtbs
    }
  })
}

const initIpcMainListeners = () => {
  // region VtbInfo
  ipcMain.on('getVtbInfos', (event: Electron.IpcMainEvent) => {
    event.reply('getVtbInfosReply', vtbInfosService.getVtbInfos())
  })
  ipcMain.on('getFollowedVtbInfos', (event: Electron.IpcMainEvent) => {
    event.reply('getFollowedVtbInfosReply', vtbInfosService.getFollowedVtbInfos())
  })
  // endregion

  // region notification
  ipcMain.on('setIsNotifiedOnStart', (event: Electron.IpcMainEvent, isNotifiedOnStart: boolean) => {
    event.reply('setIsNotifiedOnStartReply', SettingService.setIsNotifiedOnStartSync(isNotifiedOnStart))
  })
  ipcMain.on('getIsNotifiedOnStart', (event: Electron.IpcMainEvent) => {
    event.reply('getIsNotifiedOnStartReply', SettingService.getIsNotifiedOnStartSync())
  })
  // endregion

  // region follow
  ipcMain.on('getFollowedVtbMids', (event: Electron.IpcMainEvent) => {
    event.reply('getFollowedVtbMidsReply', FollowListService.getFollowedVtbMidsSync())
  })
  ipcMain.on('getFollowLists', (event: Electron.IpcMainEvent) => {
    event.reply('getFollowListsReply', FollowListService.getFollowListsSync())
  })
  ipcMain.on('addFollowList', (event: Electron.IpcMainEvent, name: string) => {
    FollowListService.addFollowListSync(name)
    event.reply('addFollowListReply', FollowListService.getFollowListsSync())
  })
  ipcMain.on('deleteFollowList', (event: Electron.IpcMainEvent, id: number) => {
    FollowListService.deleteFollowListSync(id)
    event.reply('deleteFollowListReply', FollowListService.getFollowListsSync())
  })
  ipcMain.on('renameFollowList', (event: Electron.IpcMainEvent, id: number, newName: string) => {
    FollowListService.renameFollowListSync(id, newName)
    event.reply('renameFollowListReply', FollowListService.getFollowListsSync())
  })
  ipcMain.on('toggleFollow', (event: Electron.IpcMainEvent, mid: number) => {
    FollowListService.toggleFollowSync(mid)
    event.reply('toggleFollowReply', FollowListService.getFollowedVtbMidsSync())
  })
  ipcMain.on('setFollowList', (event: Electron.IpcMainEvent, mids: number[], listId: number) => {
    FollowListService.addMidsToFollowListSync(mids, listId)
    event.reply('setFollowListReply', FollowListService.getFollowListsSync())
  })
  // endregion

  // region player
  ipcMain.on('showPlayer', (event: Electron.IpcMainEvent, roomid: number) => {
    if (playerObjMap.has(roomid)) {
      playerObjMap.get(roomid)!.playerWindow.focus()
    } else {
      const vtbInfo: VtbInfo = vtbInfosService.getVtbInfos().find((vtbInfo: VtbInfo) => {
        return vtbInfo.roomid === roomid
      })!
      playerObjMap.set(roomid, createPlayerWindow(app, vtbInfo, playerObjMap))
    }
  })
  // endregion
}

const initApp = () => {
  initUpdate()
  initSettingsConfiguration()
  initServices()
  // todo 上播提醒
  initIpcMainListeners()
}

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', async () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    mainWindow = await createWindow()
  }
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    try {
      await installExtension(VUEJS_DEVTOOLS)
    } catch (e) {
      console.error('Vue Devtools failed to install:', e.toString())
    }
  }

  try {
    initApp()
  } catch (e) {
    console.error('init app failed:', e.toString())
  }

  mainWindow = await createWindow()
})

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', (data) => {
      if (data === 'graceful-exit') {
        app.quit()
      }
    })
  } else {
    process.on('SIGTERM', () => {
      app.quit()
    })
  }
}
