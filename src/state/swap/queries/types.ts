export type FetchPairHoursDataResponse = {
  pairHourDatas: {
    id: string
    hourStartUnix: number
    pair: {
      name: string
      timestamp: string
      token0Price: string
      token1Price: string
    }
  }[]
}
