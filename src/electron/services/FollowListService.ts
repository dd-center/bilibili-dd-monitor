import { FollowList } from '@/interfaces'
import settings from 'electron-settings'
import { FollowListItem } from "@/interfaces/FollowList";

export class FollowListService {
  private static readonly FOLLOW_LISTS: string = 'followLists'

  protected constructor () {
    // don't initiate it
  }

  static initFollowListsSync () {
    if (!settings.hasSync(FollowListService.FOLLOW_LISTS)) {
      const defaultFollowList: FollowList = {
        id: 0,
        name: '默认分组',
        list: []
      }
      settings.setSync(FollowListService.FOLLOW_LISTS, [defaultFollowList] as {})
    }
  }

  static getFollowListsSync (): FollowList[] {
    return settings.getSync(FollowListService.FOLLOW_LISTS) as []
  }

  static setFollowListsSync (followLists: FollowList[]): void {
    settings.setSync(FollowListService.FOLLOW_LISTS, followLists as [])
  }

  /**
   *
   * @param name new group name
   */
  static addFollowListSync (name: string): void {
    const followLists: FollowList[] = this.getFollowListsSync()

    const followListsNextId = followLists[followLists.length - 1].id + 1
    const newFollowList = {
      id: followListsNextId,
      name: name,
      list: [] // @deprecated ,use set. Don't use list
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
    const list = followLists[followLists.findIndex((followList: FollowList) => followList.id === id)].list
    this.addItemsToFollowListSync(list, 0)

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
   * @param followListItem
   */
  static toggleFollowSync (followListItem: FollowListItem) {
    const followLists = this.getFollowListsSync()
    const defaultGroupIndex = followLists.findIndex((followList: FollowList) => followList.id === 0)

    let hasFollowedBefore = false
    // waring: this method can optimize performance by eager break
    followLists.forEach((followList: FollowList) => {
      let mids = [...followList.list.map((item) => item.mid)]
      const midIndex = mids.findIndex((listMid: number) => listMid === followListItem.mid)
      if (midIndex !== -1) {
        followList.list.splice(midIndex, 1)
        hasFollowedBefore = true
      }
    })

    // if has not followed before, then add him/her to default group
    if (!hasFollowedBefore) {
      followLists[defaultGroupIndex].list.push(followListItem)
    }

    this.setFollowListsSync(followLists)
  }

  /**
   * add mids to certain follow list with parameter id
   *
   * @param followListItems
   * @param listId
   */
  static addItemsToFollowListSync (followListItems: FollowListItem[], listId: number) {
    // move followListItems move to default group
    followListItems.forEach((followListItem) => {
      // here only for following , NOT cancel follow
      this.toggleFollowSync(followListItem)
    })

    const followLists: FollowList[] = this.getFollowListsSync()
    const followListList = followLists[followLists.findIndex((followList: FollowList) => followList.id === listId)].list
    followListList.push(...followListItems)

    this.setFollowListsSync(followLists)
  }

  /**
   * get followed vtb infos list
   */
  static getFollowedVtbMidsSync (): number[] {
    const followedVtbMids: number[] = []
    FollowListService.getFollowListsSync().forEach((followList: FollowList) => {
      followedVtbMids.push(...followList.list.map((item) => item.mid))
    })
    return followedVtbMids
  }
}
