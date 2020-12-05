import setting from 'electron-settings'

export class SettingService {
  private static readonly IS_NOTIFIED_ON_START: string = 'isNotifiedOnStart'

  static setIsNotifiedOnStartSync = (isNotifiedOnStart: boolean): boolean => {
    setting.setSync(SettingService.IS_NOTIFIED_ON_START, isNotifiedOnStart)
    return setting.getSync(SettingService.IS_NOTIFIED_ON_START) as boolean
  }

  static getIsNotifiedOnStartSync = (): boolean => {
    if (!setting.hasSync(SettingService.IS_NOTIFIED_ON_START)) {
      setting.setSync(SettingService.IS_NOTIFIED_ON_START, false)
    }
    return setting.getSync(SettingService.IS_NOTIFIED_ON_START) as boolean
  }

  static getPathOfSettings (): string {
    // in windows => C:\Users\{your-user-name}\AppData\Roaming\vue-electron-app\settings.json
    return setting.file() as string
  }
}
