import { PlayerObj } from "@/interfaces";
import { BrowserWindow } from "electron";

export default class ContextMap<K, V> extends Map {
  private context: BrowserWindow |undefined;

  constructor () {
    super()
  }

  delete (key: number): boolean {
    const result = super.delete(key);
    if (this.context) {
      console.log('delete', this.size)
    }
    return result;
  }

  set (key: number, value: PlayerObj): this {
    const map = super.set(key, value);
    if (this.context) {
      console.log('set', this.size)
    }
    return map
  }

  clear (): void {
    super.clear()
    if (this.context) {
      console.log('clear', this.size)
    }
  }

  attachContext (context: BrowserWindow) {
    if (context) {
      this.context = context
      console.log('ContextMap attach BrowserWindow')
    }
  }

  printContext () {
    console.log(this.context)
  }
}
