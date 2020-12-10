import { IpcRenderer } from 'electron'
import { Observable, Observer } from 'rxjs'
import { VtbInfo } from '@/interfaces'

declare const window: any

export default class VtbInfoService {
  private ipcRenderer: IpcRenderer

  constructor () {
    this.ipcRenderer = window.ipcRenderer
  }

  getVtbInfos (): Observable<VtbInfo[]> {
    this.ipcRenderer.send('getVtbInfos')
    return new Observable(this.sequenceSubscriber('getVtbInfos'))
  }

  /**
   * @deprecated
   * 监听后端vtb数据更新
   */
  updateVtbInfos (): Observable<VtbInfo[]> {
    return new Observable(this.sequenceSubscriber('updateVtbInfos'))
  }

  getFollowedVtbInfos (): Observable<VtbInfo[]> {
    this.ipcRenderer.send('getFollowedVtbInfos')
    return new Observable(this.sequenceSubscriber('getFollowedVtbInfos'))
  }

  private sequenceSubscriber (channel: string) {
    return (observer: Observer<any>) => {
      switch (channel) {
        case 'getVtbInfos': {
          this.ipcRenderer.once('getVtbInfosReply', (e: Electron.IpcRendererEvent, vtbInfos: VtbInfo[]) => {
            observer.next(vtbInfos)
            observer.complete()
          })
          break
        }
        case 'updateVtbInfos': {
          this.ipcRenderer.on('updateVtbInfos', (event: Electron.Event, vtbInfos: VtbInfo[]) => {
            observer.next(vtbInfos)
            observer.complete()
          })
          break
        }
        case 'getFollowedVtbInfos': {
          this.ipcRenderer.once('getFollowedVtbInfosReply', (e: Electron.IpcRendererEvent, vtbInfos: VtbInfo[]) => {
            observer.next(vtbInfos)
            observer.complete()
          })
          break
        }
      }
    }
  }
}
