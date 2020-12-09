console.log.apply(null, ['test'])

const LOG = function (prefix) {
  prefix = prefix || ''
  return function (...args) {
    // eslint-disable-next-line no-useless-call
    console.log.apply(null, [prefix, ...args])
  }
}

const log = LOG('FOO')
log('123')

const logInit = LOG('INIT')
logInit('123')
logInit('323')
logInit('42')
logInit('4')
