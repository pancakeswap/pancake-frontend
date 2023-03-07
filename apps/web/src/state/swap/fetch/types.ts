import { PairDataTimeWindowEnum } from '../types'

export type fetchPairDataParams = {
  pairId: string
  timeWindow: PairDataTimeWindowEnum
  isStableSwap?: boolean
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

export type StableSwapPairHoursDatasResponse = {
  pairHourDatas: {
    id: string
    hourStartUnix: number
    tokenPrice0: string | null
    tokenPrice1: string | null
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

export type StableSwapPairDayDatasResponse = {
  pairDayDatas: {
    id: string
    date: number
    tokenPrice0: string | null
    tokenPrice1: string | null
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
