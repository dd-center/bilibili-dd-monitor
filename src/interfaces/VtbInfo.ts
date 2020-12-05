/**
 * Vtuber 信息
 */
export interface VtbInfo {
  mid: number; // member id, 即会员id
  uuid?: string;
  uname?: string; // 名称
  video?: number; // 一般为0，意义不明
  roomid?: number; // 直播间id
  sign?: string; // 签名档
  notice?: string; // 公告
  face?: string; // 头像图片url
  rise?: number; // 粉丝变化数目，整数代表增加，负数代表减少
  topPhoto?: string; // 个人空间顶部头图url
  archiveView?: number; // 一般为0，意义不明
  follower?: number; // 粉丝数量
  liveStatus?: number; // 直播状态，1为正在直播，0为离线
  recordNum?: number; // 意义不明
  guardNum?: number; // 舰长总数量
  liveNum?: number; // 意义不明  @deprecated
  lastLive?: LastLive; // 最近一次直播时间 [online,time]
  guardChange?: number; // 舰长数变化
  guardType?: number[]; // 舰队 [总督，提督，舰长] [0,0,100]
  areaRank?: number; // 直播分区总排名
  online: number; // 人气，注意不是up的在线状态
  title?: string; // 直播间标题
  time?: number; // 意义未知
  liveStartTime?: number; // 直播开始的时间戳(毫秒)，如果不在直播，那么为0
  averageLive?: number; // @deprecated
  weekLive?: number; // @deprecated
  bot?: number; // @deprecated
}

interface LastLive {
  online?: number; // 意义不明
  time?: number; // 时间戳(毫秒) 例如1605880996178
}
