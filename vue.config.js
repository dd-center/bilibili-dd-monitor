// https://nklayman.github.io/vue-cli-plugin-electron-builder/guide/configuration.html

const packageVersion = require('./package.json').version
const packageName = require('./package.json').name
const shortcutName = packageName
const artifactNameInAppId = packageName.replace(/-/g, '_')
const winIconPath = './public/icons/icon.ico'
const macIconPath = './public/icons/icon.icns'
const linuxIconPath = './public/icons/'
const macEntitlement = './public/entitlements.mac.plist'

module.exports = {
  pluginOptions: {
    electronBuilder: {
      preload: 'src/preload.js',
      // for more options, see https://www.electron.build/configuration/configuration
      // you can use file macros(https://www.electron.build/file-patterns#file-macros) such as ${name} – package.json name
      builderOptions: {
        publish: ['github'],
        productName: `${packageName}`,
        appId: `com.dd_center.${artifactNameInAppId}`,
        copyright: 'Copyright © 2020 open source',
        releaseInfo: {
          releaseName: `${packageVersion} version update`
          // waring: releaseNotes will override github release notes. if you want to override github release note, enable it
          // releaseNotes: packageVersion + ' change log'
        },
        // see https://www.electron.build/configuration/mac
        mac: {
          icon: macIconPath,
          category: 'public.app-category.utilities',
          entitlements: macEntitlement,
          entitlementsInherit: macEntitlement,
          hardenedRuntime: false, // Whether your app has to be signed with hardened runtime.
          gatekeeperAssess: false // Whether to let electron-osx-sign validate the signing or not.
        },
        // see https://www.electron.build/configuration/linux
        linux: {
          icon: linuxIconPath,
          category: 'Utility',
          target: [
            {
              target: 'AppImage',
              arch: ['x64']
            }
          ]
        },
        // see https://www.electron.build/configuration/win
        win: {
          icon: winIconPath,
          target: [
            {
              target: 'nsis',
              arch: ['x64']
            }
          ]
        },
        // nsis configuration. see https://www.electron.build/configuration/nsis
        nsis: {
          artifactName: `${packageName}-${packageVersion}-setup.exe`,
          oneClick: false,
          perMachine: false, // false means can choose specific user or global installation
          allowElevation: true,
          allowToChangeInstallationDirectory: true,
          installerIcon: winIconPath,
          uninstallerIcon: winIconPath,
          installerHeaderIcon: winIconPath,
          createDesktopShortcut: true,
          createStartMenuShortcut: true,
          shortcutName: shortcutName
        }
      }
    }
  },
  configureWebpack: {
    devServer: {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': '*'
      }
    },
    plugins: []
  }
}
