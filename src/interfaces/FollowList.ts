/**
 * 关注列表
 */
export interface FollowListItem {
  mid: number; // 用户UID
  infoSource: string; // 内部字段，表示该followListItem获取的方式，DD_CENTER 或者 BILIBILI，等等。
  updateMethod: string; // 内部字段，表示是否可以自动更新，AUTO 或者 MANUAL
  face?: string; // 头像
  uname?: string; // 昵称
  sign?: string; // 空间描述，可能缺失。
  roomid?: number; // 直播间id
}

export interface FollowList {
  id: number; // 分组id
  name: string; // 分组名称
  list: FollowListItem[]; // 对象数组
}
