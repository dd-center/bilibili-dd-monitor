// eslint-disable-next-line @typescript-eslint/no-var-requires
const ping = require('ping')

const apiCDNList = [
  'api.vtbs.moe',
  'api.tokyo.vtbs.moe'
]

async function test () {
  for (const host of apiCDNList) {
    const res = await ping.promise.probe(host)
    if (res.alive) {
      console.log(res.avg)
    }
  }
}

test()

console.log('test')
