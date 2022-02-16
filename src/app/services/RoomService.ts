import { IpcRenderer } from 'electron'
import { Observable, Observer } from 'rxjs'

declare const window: any

export default class RoomService {
  private ipcRenderer: IpcRenderer

  constructor () {
    this.ipcRenderer = window.ipcRenderer
  }

  private sequenceSubscriber = (channel: string) => {
    return (observer: Observer<any>) => {
      switch (channel) {
        case 'getInfoByRoomReply': {
          this.ipcRenderer.once('getInfoByRoomReply', (e: Electron.IpcRendererEvent, result: any) => {
            observer.next(result)
            observer.complete()
          })
          break
        }
        default:
          break
      }
    }
  }

  getInfoByRoom (roomId: number): Observable<boolean> {
    this.ipcRenderer.send('getInfoByRoom', roomId)
    return new Observable<boolean>(this.sequenceSubscriber('getInfoByRoomReply'))
  }
}
