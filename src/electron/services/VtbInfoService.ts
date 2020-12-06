import io from 'socket.io-client'
import { FollowList, VtbInfo } from '@/interfaces'
import { FollowListService } from '@/electron/services/index'
import vtbInfosMock from '../../../test/sample/VtbInfos.json'

const socket = io('https://api.vtbs.moe')

export class VtbInfoService {
  private vtbInfosMap: Map<number, VtbInfo> = new Map<number, VtbInfo>()
  private _vtbInfosMapMock: Map<number, VtbInfo> = new Map<number, VtbInfo>()
  private update: Function | null = null
  private _onceUpdate: Function | null = null

  constructor () {
    // init socket.IO
    this.initSocketIO()

    // init mock data
    // this._initMockData()
  }

  initSocketIO () {
    socket.on('connect', () => {
      console.log('connect.')
    })

    let totalTimeInterval = 0
    let infoEventCount = 0
    let lastInfoTime = Date.now()
    socket.on('info', (infos: VtbInfo[]) => {
      // here are network statistics
      const timeInterval = Date.now() - lastInfoTime
      console.log('info.')

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
        this.update([...this.vtbInfosMap.values()])
      }

      // if has once update function, call it and reset to null
      if (this._onceUpdate) {
        this._onceUpdate([...this.vtbInfosMap.values()])
        this._onceUpdate = null
      }
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

  }

  _initMockData () {
    vtbInfosMock.forEach((info: VtbInfo) => {
      this._vtbInfosMapMock.set(info.mid, info)
    })
    console.log(`this._vtbInfosMapMock.size: ${this._vtbInfosMapMock.size}`)
  }

  stopUpdate () {
    this.update = null
  }

  onceUpdate (callback: (vtbInfos: VtbInfo[]) => void) {
    this._onceUpdate = callback
  }

  onUpdate (callback: (vtbInfos: VtbInfo[]) => void) {
    this.update = callback
  }

  getVtbInfos (): VtbInfo[] {
    return [...this.vtbInfosMap.values()].sort(this._compareByOnlineDesc)
  }

  /**
   * mock get vtbInfos
   */
  getVtbInfosMock (): VtbInfo[] {
    return [...this._vtbInfosMapMock.values()].sort(this._compareByOnlineDesc)
  }

  _compareByOnlineDesc (vtbInfoA: VtbInfo, vtbInfoB: VtbInfo): number {
    return vtbInfoB.online - vtbInfoA.online
  }

  /**
   * get followed vtb infos
   */
  getFollowedVtbInfos (): VtbInfo[] {
    let followedVtbInfos: VtbInfo[] = []
    const vtbInfos = this.getVtbInfos()
    FollowListService.getFollowListsSync().forEach((followList: FollowList) => {
      followedVtbInfos = [
        ...vtbInfos.filter((vtbInfo) => {
          followList.mids.includes(vtbInfo.mid)
        })
      ]
    })
    return followedVtbInfos.sort(this._compareByOnlineDesc)
  }

  /**
   * mock get followed vtb infos
   */
  getFollowedVtbInfosMock (): VtbInfo[] {
    let followedVtbInfos: VtbInfo[] = []
    const vtbInfos = this.getVtbInfosMock()
    FollowListService.getFollowListsSync().forEach((followList: FollowList) => {
      followedVtbInfos = [
        ...followedVtbInfos,
        ...vtbInfos.filter((vtbInfo) => followList.mids.includes(vtbInfo.mid))
      ]
    })
    return followedVtbInfos.sort(this._compareByOnlineDesc)
  }
}
