// eslint-disable-next-line @typescript-eslint/no-var-requires
const electron = require('electron')
// Importing the app module using Electron remote
const app = electron.remote.app

app.on('gpu-info-update', () => {
  console.log('GPU Information has been Updated')
})

app.on('gpu-process-crashed', (event, killed) => {
  console.log('GPU Process has crashed')
  console.log(event)
  console.log('Whether GPU Process was killed - ', killed)
})

const metrics = document.getElementById('metrics')
metrics.addEventListener('click', () => {
  console.dir(app.getAppMetrics())
})

const basic = document.getElementById('basic')
basic.addEventListener('click', () => {
  app.getGPUInfo('basic').then(basicObj => {
    console.dir(basicObj)
  })
})

const complete = document.getElementById('complete')
complete.addEventListener('click', () => {
  app.getGPUInfo('complete').then(completeObj => {
    console.dir(completeObj)
  })
})

const features = document.getElementById('features')
features.addEventListener('click', () => {
  console.dir(app.getGPUFeatureStatus())
})
