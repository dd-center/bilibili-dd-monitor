import { FollowList } from '@/interfaces'
import * as setting from 'electron-settings'

export class FollowListService {
  private static readonly FOLLOW_LISTS: string = 'followLists'

  protected constructor () {
    // don't initiate it
  }

  static initFollowListsSync () {
    if (!setting.hasSync(FollowListService.FOLLOW_LISTS)) {
      const defaultFollowList: FollowList = {
        id: 0,
        name: '默认分组',
        mids: []
      }
      setting.setSync(FollowListService.FOLLOW_LISTS, JSON.stringify([defaultFollowList]))
    }
  }

  static getFollowListsSync (): FollowList[] {
    return JSON.parse(setting.getSync(FollowListService.FOLLOW_LISTS) as string)
  }

  static setFollowListsSync (followLists: FollowList[]): void {
    setting.setSync(FollowListService.FOLLOW_LISTS, JSON.stringify(followLists))
  }

  /**
   *
   * @param name group name
   */
  static addFollowListSync (name: string): void {
    const followLists: FollowList[] = this.getFollowListsSync()

    const followListsNextId = followLists[followLists.length - 1].id + 1
    const newFollowList = {
      id: followListsNextId,
      name: name,
      mids: [] // @deprecated ,use set. Don't use list
    }
    followLists.push(newFollowList)

    this.setFollowListsSync(followLists)
  }

  /**
   * Note:
   * when delete one custom follow list, users in the original group will move to the default group (id=0)
   *
   * @param id group id
   */
  static deleteFollowListSync (id: number) {
    const followLists = this.getFollowListsSync()
    // when delete one custom follow list, users in the original group will move to the default group (id=0)
    const mids = followLists[followLists.findIndex((followList: FollowList) => followList.id === id)].mids
    this.addMidsToFollowListSync(mids, 0)

    // now group 0 and current group has duplicated mids, need to remove them from current group
    const newFollowLists = this.getFollowListsSync()
    const filteredFollowLists = newFollowLists.filter((followList: FollowList) => followList.id !== id)

    this.setFollowListsSync(filteredFollowLists)
  }

  /**
   *
   * @param id
   * @param newName
   */
  static renameFollowListSync (id: number, newName: string) {
    const followLists = this.getFollowListsSync()
    for (let i = 0; i < followLists.length; i++) {
      if (followLists[i].id === id) {
        followLists[i].name = newName
        // eager break
        break
      }
    }
    this.setFollowListsSync(followLists)
  }

  /**
   * if has been not followed, then follow him/her to default group (id 0).
   * If has already followed, cancel follow him/her to default group (id 0).
   * @param mid
   */
  static toggleFollowSync (mid: number) {
    const followLists = this.getFollowListsSync()
    const defaultGroupIndex = followLists.findIndex((followList: FollowList) => followList.id === 0)

    let hasFollowedBefore = false
    // waring: this method can optimize performance by eager break
    followLists.forEach((followList: FollowList) => {
      const midIndex = followList.mids.findIndex((listMid: number) => listMid === mid)
      if (midIndex !== -1) {
        followList.mids.splice(midIndex, 1)
        hasFollowedBefore = true
      }
    })

    // if has not followed before, then add him/her to default group
    if (!hasFollowedBefore) {
      followLists[defaultGroupIndex].mids.push(mid)
    }

    this.setFollowListsSync(followLists)
  }

  static followByRoomInfoSync (info: any): boolean {
    const mid = info.mid;
    // 遍历所有的关注列表，
    // - 如果之前已经关注过，那么返回消息，告知已经关注，操作无效。
    // - 如果之前没有关注过，那么将其添加过默认关注列表(group index 0),返回消息，告知关注成功。
    // this.toggleFollowSync(mid)
    return true
  }

  /**
   * add mids to certain follow list with parameter id
   *
   * @param mids
   * @param listId
   */

  static addMidsToFollowListSync (mids: number[], listId: number) {
    // make mids move to default group
    mids.forEach((mid: number) => {
      // here only for following mid, NOT cancel follow
      this.toggleFollowSync(mid)
    })

    const followLists: FollowList[] = this.getFollowListsSync()
    const followListMids = followLists[followLists.findIndex((followList: FollowList) => followList.id === listId)].mids
    followListMids.push(...mids)

    this.setFollowListsSync(followLists)
  }

  /**
   * get all mids of followed vtb infos
   */
  static getFollowedVtbMidsSync (): number[] {
    const followedVtbMids: number[] = []
    FollowListService.getFollowListsSync().forEach((followList: FollowList) => {
      followedVtbMids.push(...followList.mids)
    })
    return followedVtbMids
  }
}
