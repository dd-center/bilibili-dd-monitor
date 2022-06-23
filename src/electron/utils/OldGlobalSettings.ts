import settings from 'electron-settings'

export function configureSettings () {
  // make global configuration referenced to: https://electron-settings.js.org/index.html#configure
  settings.configure({
    numSpaces: 2,
    prettify: true
  })
}
