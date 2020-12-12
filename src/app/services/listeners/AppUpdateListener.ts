import { IpcRenderer, ipcRenderer } from "electron"
import { Store } from "vuex"
import store from '../../store'
import { UpdateInfo } from 'electron-updater'
import { ProgressInfo } from 'builder-util-runtime'
import { slog } from "@/main";

declare const window: any

export default class AppUpdateListener {

  private ipcRenderer: IpcRenderer
  private store: Store<{}>;

  constructor () {
    this.ipcRenderer = window.ipcRenderer
    this.store = store
    this.initDownloadProgressListener();
    this.initUpdateAvailableListener();
  }

  private initUpdateAvailableListener () {
    ipcRenderer.on('update-available', (event: Electron.Event, updateInfo: UpdateInfo) => {
      slog('update-available', updateInfo)
      // we can should dialog here. Now we can show release notes beautifully
      // step1: show dialog with ok/cancel button
      // step2: only when user click ok button, send confirm message to main process

      // now we suppose user click ok button for testing
      setTimeout(() => {
        ipcRenderer.send('user-confirm-download')
      }, 3000)
    })
  }

  private initDownloadProgressListener () {
    ipcRenderer.on('download-progress', (event: Electron.Event, progressInfo: ProgressInfo) => {
      slog('download-progress', progressInfo)
    })
  }
}
