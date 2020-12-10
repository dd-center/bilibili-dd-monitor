import { IpcRenderer } from 'electron'
import { VtbInfo } from '@/interfaces'
import store from '../store'
import { Store } from 'vuex'

declare const window: any

export default class VtbInfoUpdateListener {
  private ipcRenderer: IpcRenderer
  private store: Store<{}>;

  constructor () {
    this.ipcRenderer = window.ipcRenderer
    this.store = store
    this.initVtbInfosUpdateListener()
  }

  initVtbInfosUpdateListener () {
    this.ipcRenderer.on('updateVtbInfos', (event: Electron.Event, updatedVtbInfos: VtbInfo[], averageUpdateInterval: number) => {
      this.store.dispatch('updateVtbInfos', { updatedVtbInfos, averageUpdateInterval })
    })
  }
}
