import { VtbInfo } from '@/interfaces'

declare const window: any
export const slog = (title: any, content: any): void => {
  window.slog({ title: title, content: content })
}

export const _compareByOnlineDesc = (vtbInfoA: VtbInfo, vtbInfoB: VtbInfo): number => {
  return vtbInfoB.online - vtbInfoA.online
}
