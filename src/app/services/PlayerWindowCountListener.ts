import { IpcRenderer } from 'electron'
import { VtbInfo } from '@/interfaces'
import store from '../store'
import { Store } from 'vuex'

declare const window: any

export default class PlayerWindowCountListener {
  private ipcRenderer: IpcRenderer
  private store: Store<{}>;

  constructor () {
    this.ipcRenderer = window.ipcRenderer
    this.store = store
    this.initPlayerWindowCountListener()
  }

  initPlayerWindowCountListener () {
    this.ipcRenderer.on('updatePlayerWindowCount', (event: Electron.Event, count: number) => {
      this.store.dispatch('updatePlayerWindowCount', count)
    })
  }
}
