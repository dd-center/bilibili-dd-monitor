/**
 * 关注列表
 */
export interface FollowList {
  id: number; // 分组id
  name: string; // 分组名称
  mids: number[]; // 一个数组，数组元素为bili用户mid @deprecated use number set
}
