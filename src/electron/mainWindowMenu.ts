import { dialog, Menu, MenuItem, screen, shell } from 'electron'
import { PlayerObj } from '@/interfaces'
import { checkForUpdates } from '@/electron/updater'
import ContextMap from '@/electron/utils/ContextMap'

export const createMainWindowMenu = (app: Electron.App, players: ContextMap<number, PlayerObj>) => {
  const primaryDisplays: Electron.Display[] = screen.getAllDisplays()
  const autoSetPlayerBounds = (display: Electron.Display) => {
    // example: 1080/1920 =0.55
    const displayProportion = display.size.height / display.size.width
    const playerNum = players.size
    if (playerNum > 0) {
      const {
        width,
        height
      } = display.workAreaSize
      const getProportion = (playerNum: number, rowNum: number) => {
        const colNum = Math.ceil(playerNum / rowNum)
        return (rowNum / colNum) * displayProportion // (rowNum / colNum)的值越接近于1，最终值越接近displayProportion
      }

      // todo replaced by square algorithm
      // get best row number => (rowNum / colNum) ≈ 1
      let bestRowNumber = -1
      let min = Number.MAX_SAFE_INTEGER
      for (let rowNum = 1; rowNum <= playerNum; rowNum++) {
        // getProportion(playerNum, rowNum) => computed proportion
        // displayProportion => your physical screen proportion
        // abs(Difference) => deviation
        // The smaller the deviation, the better multi-screen display effect
        const deviation = Math.abs(getProportion(playerNum, rowNum) - displayProportion)
        if (deviation < min) {
          min = deviation
          bestRowNumber = rowNum
        }
      }

      const bestColNumber = Math.ceil(playerNum / bestRowNumber)

      // compute playerWidth and playerHeight by bestRowNumber
      const playerWidth = Math.floor(width / bestColNumber)
      const playerHeight = Math.floor(height / bestRowNumber);

      [...players.values()].forEach((player: PlayerObj, index: number) => {
        const row = Math.floor(index / bestColNumber)
        const col = index % bestColNumber
        try {
          // what's display.bounds.x, debug its value is 0
          player.playerWindow.setBounds({
            x: display.bounds.x + col * playerWidth,
            y: display.bounds.y + row * playerHeight,
            height: playerHeight,
            width: playerWidth
          })
        } catch (e) {
        }
      })
    }
  }
  const template = [
    ...(process.platform === 'darwin' ? [{
      label: app.getName(),
      submenu: [
        { role: 'about' },
        { type: 'separator' },
        { role: 'services' },
        { type: 'separator' },
        { role: 'hide' },
        { role: 'hideothers' },
        { role: 'unhide' },
        { type: 'separator' },
        { role: 'quit' }
      ]
    }] : []), {
      label: '播放器',
      submenu: [
        {
          label: '置顶当前所有播放器',
          click: () => {
            players.forEach((player: PlayerObj) => {
              player.playerWindow.setAlwaysOnTop(true)
            })
          }
        },
        {
          label: '取消置顶当前所有播放器',
          click: () => {
            players.forEach((player: PlayerObj) => {
              player.playerWindow.setAlwaysOnTop(false)
            })
          }
        },
        {
          label: '自动重排窗口',
          submenu: primaryDisplays.map((display: Electron.Display, index: number): Electron.MenuItem => ({
            label: `显示器${index.toString()} ${display.size.width} X ${display.size.height}`,
            click: (() => {
              return autoSetPlayerBounds(display)
            }) as Function
          } as MenuItem))
        },
        {
          label: '显示所有播放器',
          click: () => {
            players.forEach((player: PlayerObj) => {
              player.playerWindow.show()
            })
          }
        },
        {
          label: '最小化所有播放器',
          click: () => {
            players.forEach((player: PlayerObj) => {
              player.playerWindow.minimize()
            })
          }
        },
        {
          label: '关闭所有播放器',
          click: () => {
            players.forEach((playerObj: PlayerObj) => {
              if (playerObj.playerWindow) {
                playerObj.playerWindow.close()
              }
            })
          }
        }
      ]
    }, {
      label: '帮助',
      submenu: [
        {
          label: '帮助文档',
          click: () => {
            shell.openExternal('https://github.com/wdpm/bilibili-dd-monitor')
          }
        },
        {
          label: '问题反馈',
          click: () => {
            shell.openExternal('https://github.com/wdpm/bilibili-dd-monitor/issues')
          }
        },
        {
          label: '检测更新',
          click: (menuItem: MenuItem, focusedWindow: Electron.BrowserWindow) => {
            checkForUpdates(menuItem, focusedWindow)
          }
        },
        {
          label: '关于',
          click: (item: any, focusedWindow: Electron.BrowserWindow) => {
            const options = {
              type: 'info',
              title: '关于',
              message: `bilibili-dd-center Powered By DD. 当前版本:${app.getVersion()}`
            }
            dialog.showMessageBox(focusedWindow, options)
          }
        },
        {
          label: '打开主窗口调试控制台',
          click: (item: any, focusedWindow: { toggleDevTools: () => void }) => {
            if (focusedWindow) {
              focusedWindow.toggleDevTools()
            }
          }
        }
      ]
    }
  ]

  return Menu.buildFromTemplate(template as any)
}
