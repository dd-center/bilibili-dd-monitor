import { IpcRenderer } from 'electron'
import { VtbInfo } from '@/interfaces'

declare const window: any

export default class NoticeService {
  private ipcRenderer: IpcRenderer

  constructor () {
    this.ipcRenderer = window.ipcRenderer
    this.ipcRenderer.on('liveNotice', (event: Electron.IpcRendererEvent, vtbInfo: VtbInfo, extra: string) => {
      const notification = new Notification(extra + ' ' + vtbInfo.uname, {
        body: vtbInfo.title,
        icon: vtbInfo.face,
        actions: []
      })
      notification.onclick = () => {
        this.ipcRenderer.send('showPlayer', vtbInfo.roomid)
      }
    })
  }
}
