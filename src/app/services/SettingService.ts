import { IpcRenderer } from 'electron'
import { Observable, Observer } from 'rxjs'

declare const window: any
export default class SettingService {
  private ipcRenderer: IpcRenderer

  constructor () {
    this.ipcRenderer = window.ipcRenderer
  }

  private sequenceSubscriber = (channel: string) => {
    return (observer: Observer<any>) => {
      switch (channel) {
        case 'setIsNotifiedOnStartReply': {
          this.ipcRenderer.once('setIsNotifiedOnStartReply', (e: Electron.IpcRendererEvent, isNotifiedOnStart: boolean) => {
            observer.next(isNotifiedOnStart)
            observer.complete()
          })
          break
        }
        case 'getIsNotifiedOnStartReply': {
          this.ipcRenderer.once('getIsNotifiedOnStartReply', (e: Electron.IpcRendererEvent, isNotifiedOnStart: boolean) => {
            observer.next(isNotifiedOnStart)
            observer.complete()
          })
          break
        }
      }
    }
  }

  setIsNotifiedOnStart (isNotifiedOnStart: boolean): Observable<boolean> {
    this.ipcRenderer.send('setIsNotifiedOnStart', isNotifiedOnStart)
    return new Observable<boolean>(this.sequenceSubscriber('setIsNotifiedOnStartReply'))
  }

  getIsNotifiedOnstart (): Observable<boolean> {
    this.ipcRenderer.send('getIsNotifiedOnStart')
    return new Observable<boolean>(this.sequenceSubscriber('getIsNotifiedOnStartReply'))
  }
}
