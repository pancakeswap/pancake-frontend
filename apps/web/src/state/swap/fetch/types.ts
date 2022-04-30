import { PairDataTimeWindowEnum } from '../types'

export type fetchPairDataParams = {
  pairId: string
  timeWindow: PairDataTimeWindowEnum
}

export type LastPairHourIdResponse = {
  pairHourDatas: {
    id: string
  }[]
}

export type LastPairDayIdResponse = {
  pairDayDatas: {
    id: string
  }[]
}

export type PairHoursDatasResponse = {
  pairHourDatas: {
    id: string
    hourStartUnix: number
    reserve0: string
    reserve1: string
    reserveUSD: string
    pair: {
      token0: {
        id: string
      }
      token1: {
        id: string
      }
    }
  }[]
}

export type PairDayDatasResponse = {
  pairDayDatas: {
    id: string
    date: number
    reserve0: string
    reserve1: string
    reserveUSD: string
    pairAddress: {
      token0: {
        id: string
      }
      token1: {
        id: string
      }
    }
  }[]
}
