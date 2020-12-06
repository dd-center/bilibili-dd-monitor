import ping, { PingResponse } from 'ping'

export default class PingService {
  static readonly apiCDNList = [
    'api.vtbs.moe',
    'api.tokyo.vtbs.moe',
    'vtbs.musedash.moe'
  ]

  static async ping (): Promise<PingResponse[]> {
    const pingResultArr: PingResponse[] = []
    for (const host of this.apiCDNList) {
      pingResultArr.push(await ping.promise.probe(host))
    }
    return pingResultArr
  }
}
