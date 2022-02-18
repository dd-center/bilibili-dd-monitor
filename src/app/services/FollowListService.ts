import { IpcRenderer } from 'electron'
import { Observable, Observer } from 'rxjs'
import { FollowList, FollowListItem } from '@/interfaces'

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
        case 'followByRoomInfoReply': {
          this.ipcRenderer.once('followByRoomInfoReply', (e: Electron.IpcRendererEvent, flag: boolean) => {
            observer.next(flag)
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
   * @param followListItem
   */
  toggleFollow (followListItem: FollowListItem): Observable<FollowList[]> {
    this.ipcRenderer.send('toggleFollow', followListItem)
    return new Observable<FollowList[]>(this.sequenceSubscriber('toggleFollowReply'))
  }

  followByRoomInfo (info: any) {
    this.ipcRenderer.send('followByRoomInfo', info)
    return new Observable<FollowList[]>(this.sequenceSubscriber('followByRoomInfoReply'))
  }

  /**
   * add certain followListItems to certain list
   * @param followListItems
   * @param listId
   */
  addItemsToFollowList (followListItems: FollowListItem[], listId: number): Observable<FollowList[]> {
    this.ipcRenderer.send('setFollowList', followListItems, listId)
    return new Observable<FollowList[]>(this.sequenceSubscriber('setFollowListReply'))
  }
}
