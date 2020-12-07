// eslint-disable-next-line @typescript-eslint/no-var-requires
const io = require('socket.io-client')

const apiCDNList = [
  'https://api.vtbs.moe',
  'https://api.tokyo.vtbs.moe',
  'https://vtbs.musedash.moe'
]

const socket = io(apiCDNList[0])

socket.on('connect', () => {
  console.log('connect.')
})

let totalTimeInterval = 0
let infoEventCount = 0
let lastInfoTime = Date.now()
socket.on('info', (infos) => {
  const timeInterval = Date.now() - lastInfoTime
  console.log(timeInterval)
  lastInfoTime = Date.now()

  totalTimeInterval += timeInterval
  infoEventCount++
  const averageInternalInMilliSeconds = Math.round(totalTimeInterval / infoEventCount)
  console.log(`average internal statistics: ${averageInternalInMilliSeconds}`)

  console.log(`infos.length=${infos.length}`)
})

socket.on('disconnect', () => {
  console.log('disconnect.')
})

socket.on('reconnect', (attemptNumber) => {
  console.log('reconnect')
})

socket.on('reconnecting', (attemptNumber) => {
  console.log('reconnecting')
})

socket.on('reconnect_error', (error) => {
  console.log('reconnect_error')
})

socket.on('reconnect_failed', () => {
  console.log('reconnect_failed')
})

socket.on('connect_error', (error) => {
  console.log('connect_error')
})

socket.on('connect_timeout', (timeout) => {
  console.log('connect_timeout')
})

socket.on('error', (error) => {
  console.log('error')
})
