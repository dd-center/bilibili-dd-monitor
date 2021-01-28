// eslint-disable-next-line @typescript-eslint/no-var-requires
const request = require('request')
const url = 'https://api.vtbs.moe/v1/info'

function callback (err, response, body) {
  const end = Date.now()
  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  console.log('time used:' + (end - start))
  console.log(err)
  console.log(response.statusCode)
  const vtbs = JSON.parse(body)
  console.log(vtbs.length)
}

const start = Date.now()
request(url, callback)
