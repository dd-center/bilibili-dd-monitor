import { IpcRenderer } from 'electron'
import { Observable, Observer } from 'rxjs'
import { FollowList, VtbInfo } from '@/interfaces'

declare const window: any
/**
 * refactor to singleton
 */
export default class FollowListService {
  private ipcRenderer: IpcRenderer

  constructor () {
    this.ipcRenderer = window.ipcRenderer
  }

  private sequenceSubscriber = (channel: string) => {
    return (observer: Observer<any>) => {
      switch (channel) {
        case 'getFollowListsReply': {
          this.ipcRenderer.once('getFollowListsReply', (e: Electron.IpcRendererEvent, followLists: FollowList[]) => {
            observer.next(followLists)
            observer.complete()
          })
          break
        }
        case 'addFollowListReply': {
          this.ipcRenderer.once('addFollowListReply', (e: Electron.IpcRendererEvent, followLists: FollowList[]) => {
            observer.next(followLists)
            observer.complete()
          })
          break
        }
        case 'deleteFollowListReply': {
          this.ipcRenderer.once('deleteFollowListReply', (e: Electron.IpcRendererEvent, followLists: FollowList[]) => {
            observer.next(followLists)
            observer.complete()
          })
          break
        }
        case 'renameFollowListReply': {
          this.ipcRenderer.once('renameFollowListReply', (e: Electron.IpcRendererEvent, followLists: FollowList[]) => {
            observer.next(followLists)
            observer.complete()
          })
          break
        }
        case 'toggleFollowReply': {
          this.ipcRenderer.once('toggleFollowReply', (e: Electron.IpcRendererEvent, followLists: FollowList[]) => {
            observer.next(followLists)
            observer.complete()
          })
          break
        }
        case 'setFollowListReply': {
          this.ipcRenderer.once('setFollowListReply', (e: Electron.IpcRendererEvent, followLists: FollowList[]) => {
            observer.next(followLists)
            observer.complete()
          })
          break
        }
        case 'getFollowedVtbMids': {
          this.ipcRenderer.once('getFollowedVtbMidsReply', (e: Electron.IpcRendererEvent, vtbInfos: VtbInfo[]) => {
            observer.next(vtbInfos)
            observer.complete()
          })
          break
        }
      }
    }
  }

  /**
   * get all follow list
   */
  getFollowLists (): Observable<FollowList[]> {
    this.ipcRenderer.send('getFollowLists')
    return new Observable<FollowList[]>(this.sequenceSubscriber('getFollowListsReply'))
  }

  /**
   * create new group
   * @param name
   */
  addFollowList (name: string): Observable<FollowList[]> {
    this.ipcRenderer.send('addFollowList', name)
    return new Observable<FollowList[]>(this.sequenceSubscriber('addFollowListReply'))
  }

  /**
   * delete group
   * @param id
   */
  deleteFollowList (id: number): Observable<FollowList[]> {
    this.ipcRenderer.send('deleteFollowList', id)
    return new Observable<FollowList[]>(this.sequenceSubscriber('deleteFollowListReply'))
  }

  /**
   * rename certain group
   * @param id
   * @param newName
   */
  renameFollowList (id: number, newName: string): Observable<FollowList[]> {
    this.ipcRenderer.send('renameFollowList', id, newName)
    return new Observable<FollowList[]>(this.sequenceSubscriber('renameFollowListReply'))
  }

  /**
   * toggle follow
   * @param mid
   */
  toggleFollow (mid: number): Observable<number[]> {
    this.ipcRenderer.send('toggleFollow', mid)
    return new Observable<number[]>(this.sequenceSubscriber('toggleFollowReply'))
  }

  /**
   * add all mids to certain group
   * @param mids
   * @param id
   */
  addMidsToFollowList (mids: number[], id: number): Observable<FollowList[]> {
    this.ipcRenderer.send('setFollowList', mids, id)
    return new Observable<FollowList[]>(this.sequenceSubscriber('setFollowListReply'))
  }

  getFollowedVtbMids (): Observable<number[]> {
    this.ipcRenderer.send('getFollowedVtbMids')
    return new Observable(this.sequenceSubscriber('getFollowedVtbMids'))
  }
}
