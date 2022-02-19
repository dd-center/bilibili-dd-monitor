import settings from 'electron-settings'
import { shell } from 'electron'

export class SettingService {
  private static readonly IS_NOTIFIED_ON_START: string = 'isNotifiedOnStart'

  static setIsNotifiedOnStartSync = (isNotifiedOnStart: boolean): boolean => {
    settings.setSync(SettingService.IS_NOTIFIED_ON_START, isNotifiedOnStart)
    return settings.getSync(SettingService.IS_NOTIFIED_ON_START) as boolean
  }

  static getIsNotifiedOnStartSync = (): boolean => {
    if (!settings.hasSync(SettingService.IS_NOTIFIED_ON_START)) {
      settings.setSync(SettingService.IS_NOTIFIED_ON_START, false)
    }
    return settings.getSync(SettingService.IS_NOTIFIED_ON_START) as boolean
  }

  static getPathOfSettings (): string {
    // in windows => C:\Users\{your-user-name}\AppData\Roaming\{app-name}\settings.json
    return settings.file() as string
  }

  static openPathOfSettings (): void {
    shell.showItemInFolder(this.getPathOfSettings())
  }
}
