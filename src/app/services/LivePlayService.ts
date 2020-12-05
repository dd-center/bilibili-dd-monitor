import { IpcRenderer } from 'electron'

declare const window: any

export default class LivePlayService {
  private ipcRenderer: IpcRenderer

  constructor () {
    this.ipcRenderer = window.ipcRenderer
  }

  enterRoom (roomid: number) {
    this.ipcRenderer.send('showPlayer', roomid)
  }
}
