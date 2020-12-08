import { IpcRenderer } from 'electron'
import { VtbInfo } from '@/interfaces'
import store from '../store'
import { Store } from 'vuex'

declare const window: any

export default class VtbInfoUpdateListenerService {
  private ipcRenderer: IpcRenderer
  private store: Store<{}>;

  constructor () {
    this.ipcRenderer = window.ipcRenderer
    this.store = store
    this.initVtbInfosUpdateListener()
  }

  initVtbInfosUpdateListener () {
    this.ipcRenderer.on('updateVtbInfos', (event: Electron.Event, vtbInfos: VtbInfo[]) => {
      this.store.dispatch('updateVtbInfos', vtbInfos)
    })
  }
}
