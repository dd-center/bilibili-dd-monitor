import { ipcRenderer } from 'electron'
window.ipcRenderer = ipcRenderer

for (const type of ['chrome', 'node', 'electron']) {
  console.log(`${type}: ${process.versions[type]}`)
}
