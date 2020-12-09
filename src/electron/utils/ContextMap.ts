import { PlayerObj } from "@/interfaces";
import { BrowserWindow } from "electron";

export default class ContextMap<K, V> extends Map {
  private context: BrowserWindow | undefined | null;

  constructor () {
    super()
  }

  delete (key: number): boolean {
    const result = super.delete(key);
    this.handlePlayerWindowCountChange(this.size)
    return result;
  }

  set (key: number, value: PlayerObj): this {
    const map = super.set(key, value);
    this.handlePlayerWindowCountChange(this.size)
    return map
  }

  clear (): void {
    super.clear()
    this.handlePlayerWindowCountChange(this.size)
  }

  attachContext (context: BrowserWindow) {
    if (context) {
      this.context = context
      console.log('ContextMap attach BrowserWindow')
    }
  }

  handlePlayerWindowCountChange (count: number) {
    if (this.context) {
      this.context.webContents.send('updatePlayerWindowCount', count)
    }
  }

  detachContext () {
    this.context = null
  }

  printContext () {
    console.log('ContextMap context: ', this.context)
  }
}
