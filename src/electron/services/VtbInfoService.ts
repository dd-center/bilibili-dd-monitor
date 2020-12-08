import io from 'socket.io-client'
import { FollowList, VtbInfo } from '@/interfaces'
import { FollowListService } from '@/electron/services/index'
import vtbInfosMock from '../../../test/sample/VtbInfos.json'

const socket = io('https://api.vtbs.moe')

export class VtbInfoService {
  // vtbInfosMap means  all the vtb infos
  private vtbInfosMap: Map<number, VtbInfo> = new Map<number, VtbInfo>()
  private update: Function | null = null
  private _onceUpdate: Function | null = null

  constructor () {
    // init socket.IO
    this.initSocketIO()

    // init mock data
    // this._initMockData()
  }

  initSocketIO () {
    let totalTimeInterval = 0
    let infoEventCount = 0
    let lastInfoTime = Date.now()
    socket.on('info', (infos: VtbInfo[]) => {
      // here are network statistics
      const timeInterval = Date.now() - lastInfoTime
      lastInfoTime = Date.now()

      totalTimeInterval += timeInterval
      infoEventCount++
      const averageInternalInMilliSeconds = Math.round(totalTimeInterval / infoEventCount)
      console.log(`average internal statistics: ${averageInternalInMilliSeconds}`)
      console.log(`infos.length=${infos.length}`)

      // insert or update info
      infos.forEach((info: VtbInfo, index, array) => {
        this.vtbInfosMap.set(info.mid, info)
      })

      // if have update function, call it
      if (this.update) {
        this.update([...this.vtbInfosMap.values()], infos.sort(this._compareByOnlineDesc))
      }

      // if has once update function, call it and reset to null
      if (this._onceUpdate) {
        this._onceUpdate([...this.vtbInfosMap.values()])
        this._onceUpdate = null
      }
    })

    //region socket listeners
    socket.on('connect', () => {
      console.log('connect.')
    })
    socket.on('disconnect', () => {
      console.log('disconnect.')
    })
    socket.on('reconnect', () => {
      console.log('reconnect')
    })
    socket.on('reconnecting', () => {
      console.log('reconnecting')
    })
    socket.on('reconnect_error', (error: any) => {
      console.log('reconnect_error')
    })
    socket.on('reconnect_failed', () => {
      console.log('reconnect_failed')
    })
    socket.on('connect_error', (error: any) => {
      console.log('connect_error')
    })
    socket.on('connect_timeout', (timeout: any) => {
      console.log('connect_timeout')
    })
    socket.on('error', (error: any) => {
      console.log('error')
    })
    //endregion
  }

  _initMockData () {
    vtbInfosMock.forEach((info: VtbInfo) => {
      this.vtbInfosMap.set(info.mid, info)
    })
    console.log(`this._vtbInfosMapMock.size: ${this.vtbInfosMap.size}`)
  }

  stopUpdate () {
    this.update = null
  }

  onceUpdate (callback: (vtbInfos: VtbInfo[]) => void) {
    this._onceUpdate = callback
  }

  onUpdate (callback: (allVtbInfos: VtbInfo[], updatedVtbInfos: VtbInfo[]) => void) {
    this.update = callback
  }

  getVtbInfos (): VtbInfo[] {
    return [...this.vtbInfosMap.values()].sort(this._compareByOnlineDesc)
  }

  /**
   * get followed vtb infos
   */
  getFollowedVtbInfos (): VtbInfo[] {
    let followedVtbInfos: VtbInfo[] = []
    const vtbInfos = this.getVtbInfos()
    FollowListService.getFollowListsSync().forEach((followList: FollowList) => {
      followedVtbInfos = [
        ...followedVtbInfos,
        ...vtbInfos.filter((vtbInfo) => {
          return followList.mids.includes(vtbInfo.mid)
        })
      ]
    })
    return followedVtbInfos.sort(this._compareByOnlineDesc)
  }

  _compareByOnlineDesc (vtbInfoA: VtbInfo, vtbInfoB: VtbInfo): number {
    return vtbInfoB.online - vtbInfoA.online
  }
}
