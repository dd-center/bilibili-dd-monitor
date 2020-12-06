// eslint-disable-next-line @typescript-eslint/no-var-requires
const ping = require('ping')

const apiCDNList = [
  'api.vtbs.moe',
  'api.tokyo.vtbs.moe',
  'vtbs.musedash.moe'
]

async function test () {
  for (const host of apiCDNList) {
    const res = await ping.promise.probe(host)
    console.log(res.alive ? res.avg : '')
  }
}

test()
