import { IpcRenderer } from 'electron'
import { Store } from 'vuex'
import store from '../../store'
import { UpdateInfo } from 'electron-updater'
import { ProgressInfo } from 'builder-util-runtime'
import { slog } from '@/main'

declare const window: any

export default class AppUpdateListener {
  private ipcRenderer: IpcRenderer
  private store: Store<{}>;

  constructor () {
    this.ipcRenderer = window.ipcRenderer
    this.store = store
    this.initDownloadProgressListener()
    this.initUpdateAvailableListener()
  }

  private initUpdateAvailableListener () {
    this.ipcRenderer.on('update-available', (event: Electron.Event, updateInfo: UpdateInfo) => {
      slog('update-available', updateInfo)
      this.store.dispatch('toggleShowUpdateAvailableModal', updateInfo)
    })
  }

  private initDownloadProgressListener () {
    this.ipcRenderer.on('download-progress', (event: Electron.Event, progressInfo: ProgressInfo) => {
      slog('download-progress', progressInfo)
    })
  }
}
