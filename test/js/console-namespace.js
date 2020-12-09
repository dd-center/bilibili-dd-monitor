// console.log('[INIT]', 'some thing')

const LOG = function (prefix) {
  prefix = prefix || ''
  return function (...args) {
    console.log.apply(console, [prefix, ...args])
  }
}

const log = LOG('FOO')
log('123')

const logInit = LOG('INIT')
logInit('123')
logInit('323')
logInit('42')
logInit('4')
