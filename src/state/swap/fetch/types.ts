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
    pair: {
      token0: {
        id: string
      }
      token1: {
        id: string
      }
      name: string
      timestamp: string
      token0Price: string
      token1Price: string
    }
  }[]
}

export type PairDayDatasResponse = {
  pairDayDatas: {
    id: string
    date: number
    pairAddress: {
      token0: {
        id: string
      }
      token1: {
        id: string
      }
      name: string
      timestamp: string
      token0Price: string
      token1Price: string
    }
  }[]
}
