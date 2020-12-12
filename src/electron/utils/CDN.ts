import ping from 'ping'

export default class CDN {
  private static readonly apiCDNList: string[] = [
    'api.vtbs.moe',
    'api.tokyo.vtbs.moe'
  ]

  static async getBestCDN (): Promise<string> {
    for (const host of this.apiCDNList) {
      const res = await ping.promise.probe(host)
      if (res.alive) {
        // do better: choose the smallest AVG delay cdn
        return 'https://' + host
      }
    }
    return ''
  }
}
