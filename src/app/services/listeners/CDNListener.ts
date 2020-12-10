import { IpcRenderer } from 'electron'
import store from '../../store'
import { Store } from 'vuex'

declare const window: any

export default class VtbInfoUpdateListener {
  private ipcRenderer: IpcRenderer
  private store: Store<{}>;

  constructor () {
    this.ipcRenderer = window.ipcRenderer
    this.store = store
    this.initCurrentCDNListener()
  }

  initCurrentCDNListener () {
    this.ipcRenderer.on('updateCurrentCDN', (event: Electron.Event, currentCDN: string) => {
      this.store.dispatch('updateCurrentCDN', currentCDN)
    })
  }
}
