import { ipcRenderer } from 'electron'
import slog from 'shields-log'
window.ipcRenderer = ipcRenderer
window.slog = slog
