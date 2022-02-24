import { PlayerObj } from '@/interfaces'
import { BrowserWindow } from 'electron'

// ContextMap in here is BrowserWindow
// another way: make a field called map. DON't extend Map
export default class ContextMap<K, V> extends Map {
  private context: BrowserWindow | undefined | null

  constructor () {
    super()
  }

  deleteAndNotify (key: number): boolean {
    const result = this.delete(key)
    this.handlePlayerWindowCountChange(this.size)
    return result
  }

  setAndNotify (key: number, value: PlayerObj): this {
    const map = this.set(key, value)
    this.handlePlayerWindowCountChange(this.size)
    return map
  }

  private handlePlayerWindowCountChange (count: number) {
    try {
      if (this.context && this.context.webContents && this.context.webContents.send) {
        this.context.webContents.send('updatePlayerWindowCount', count)
      }
    } catch (e) {
      // TypeError: Object has been destroyed
      console.log(e)
    }
  }

  attachContext (context: BrowserWindow) {
    if (context) {
      this.context = context
    }
  }

  detachContext () {
    this.context = null
  }
}
