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
    this.ipcRenderer.on('vtbInfosUpdate', (event: Electron.Event, vtbInfos: VtbInfo[]) => {
      console.log('vtbInfosUpdate reply')
      console.log(`vtbInfosUpdate reply:${vtbInfos.length}`)
      // call vuex actions
      this.store.dispatch('updateVtbInfos', vtbInfos)
      console.log('store dispatch updateVtbInfos action')
    })
  }
}
