import { BrowserWindow } from 'electron'

/**
 * 直播间播放器对象
 */
export interface PlayerObj {
  roomid: number | undefined; // 直播间id
  playerWindow: BrowserWindow; // 播放器窗口
}
