// https://www.npmjs.com/package/cat-loggr
// fatal
// error
// warn
// trace
// init
// info
// verbose
// debug (aliases: log, dir)
// If defined, the info level is default. If not, the lowest priority level is default.

// eslint-disable-next-line @typescript-eslint/no-var-requires
const CatLoggr = require('cat-loggr')
const loggr = new CatLoggr()
loggr.verbose('Hello, world!')
loggr.info('Hello, world!')
loggr.init('init level ', 'Hello, world!')
// loggr.trace('Hello, world!');
loggr.warn('Hello, world!')
loggr.error('Hello, world!')
loggr.fatal('Hello, world!')
