'use strict'

import { app, protocol, BrowserWindow, ipcMain } from 'electron'
import installExtension, { VUEJS_DEVTOOLS } from 'electron-devtools-installer'
import settings from 'electron-settings'

import { FollowListService, SettingService, VtbInfoService } from '@/electron/services'
import { PlayerObj, VtbInfo } from '@/interfaces'
import { createPlayerWindow } from '@/electron/playerWindow'
import { createMainWindow } from '@/electron/mainWindow'
import ContextMap from "@/electron/utils/ContextMap";
import log from "pretty-log";

let vtbInfosService: VtbInfoService
let mainWindow: BrowserWindow
const playerObjMap = new ContextMap<number, PlayerObj>()
const isDevelopment = process.env.NODE_ENV !== 'production'

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } }
])

const initUpdate = () => {
  log.debug('INIT Updater')
}

const initSettingsConfiguration = () => {
  log.debug('INIT SettingsConfiguration')
  settings.configure({
    numSpaces: 2,
    prettify: true
  })
  // init follow setting
  FollowListService.initFollowListsSync()
}

const initServices = () => {
  log.debug('INIT Services')

  // init socket.io
  vtbInfosService = new VtbInfoService()
  // region VtbInfo
  ipcMain.on('getVtbInfos', (event: Electron.IpcMainEvent) => {
    event.reply('getVtbInfosReply', vtbInfosService.getVtbInfos())
  })
  ipcMain.on('getFollowedVtbInfos', (event: Electron.IpcMainEvent) => {
    event.reply('getFollowedVtbInfosReply', vtbInfosService.getFollowedVtbInfos())
  })
  // endregion

  // register live change notifications
  // 上次记录的vtbs（已经处理上播和下播提醒）
  let lastLiveVtbs: number[] = []
  vtbInfosService.onUpdate((allVtbInfos, updatedVtbInfos: VtbInfo[], averageUpdateInterval: number) => {
    if (mainWindow) {
      mainWindow.webContents.send('updateVtbInfos', updatedVtbInfos, averageUpdateInterval)

      const followVtbs = FollowListService.getFollowedVtbMidsSync()
      // 现在正在直播的vtbs
      const nowLiveFollowedVtbs =
        allVtbInfos
        .filter((vtbInfo: VtbInfo) => (followVtbs.includes(vtbInfo.mid) && vtbInfo.liveStatus === 1))
        .map((vtbInfo: VtbInfo) => vtbInfo.mid)
      // log.debug(`nowLiveFollowedVtbs: ${nowLiveFollowedVtbs.length}`)

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

      // log.debug(`upLiveFollowedVtbs: ${upLiveFollowedVtbs.length}`)
      // log.debug(`downLiveFollowedVtbs: ${downLiveFollowedVtbs.length}`)

      // 当前记录的vtbs数量不为0，或者设置启动时接受通知为true。派发上播和下播提醒。
      // optimize：使用debounce避免某个时刻通知过多而导致疯狂弹窗。
      if ((lastLiveVtbs.length !== 0) || SettingService.getIsNotifiedOnStartSync()) {
        upLiveFollowedVtbs.forEach((mid: number) => {
          mainWindow.webContents.send('liveNotice', allVtbInfos.find((vtbInfo: VtbInfo) => vtbInfo.mid === mid), '上播提醒')
        })
        downLiveFollowedVtbs.forEach((mid: number) => {
          mainWindow.webContents.send('liveNotice', allVtbInfos.find((vtbInfo: VtbInfo) => vtbInfo.mid === mid), '下播提醒')
        })
      }

      // 将当前直播vtbs记录赋值为lastLiveVtbs
      lastLiveVtbs = nowLiveFollowedVtbs
    }
  })
}

/**
 * depend on vtbInfosService, must init after new VtbInfosService()
 */
const initIpcMainListeners = () => {
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
    event.reply('toggleFollowReply', FollowListService.getFollowListsSync())
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
      if (vtbInfosService) {
        const vtbInfo: VtbInfo = vtbInfosService.getVtbInfos().find((vtbInfo: VtbInfo) => {
          return vtbInfo.roomid === roomid
        })!
        playerObjMap.set(roomid, createPlayerWindow(app, vtbInfo, playerObjMap))
      }
    }
  })
  // endregion
}

const onMainWindowClose = () => {
  //BUG: this method will call twice on dev environment
  if (mainWindow) {
    mainWindow.on('close', () => {
      // stop vtbInfo service
      if (vtbInfosService) vtbInfosService.stopUpdate()

      // clean ipcMain listeners
      ipcMain.removeAllListeners()

      // clean up playerObjMap
      playerObjMap.forEach((playerObj: PlayerObj) => {
        if (playerObj.playerWindow) playerObj.playerWindow.close()
      })
      playerObjMap.clear()

      // exit app
      app.quit()
    })
  }
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
    mainWindow = await createMainWindow(app, playerObjMap)
  }
})

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

  // pre setup
  initUpdate()
  initSettingsConfiguration()
  initIpcMainListeners()

  mainWindow = await createMainWindow(app, playerObjMap)
  onMainWindowClose()

  // post setup
  initServices()
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
