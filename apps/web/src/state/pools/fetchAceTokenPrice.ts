import { ChainId } from '@pancakeswap/chains'
import dayjs from 'dayjs'
import { v3InfoClients } from 'utils/graphql'
import { ONE_HOUR_SECONDS, SUBGRAPH_START_BLOCK, TimeWindow } from 'views/V3Info/constants'
import { fetchTokenPriceData } from 'views/V3Info/data/token/priceData'

export const fetchAceTokenPrice = async (tokenAddress: string) => {
  const utcCurrentTime = dayjs()
  const startTimestamp = utcCurrentTime
    .subtract(1, TimeWindow.WEEK ?? 'day')
    .startOf('hour')
    .unix()

  const result = await fetchTokenPriceData(
    tokenAddress,
    ONE_HOUR_SECONDS,
    startTimestamp,
    v3InfoClients[ChainId.BSC],
    'BSC',
    SUBGRAPH_START_BLOCK[ChainId.BSC],
  )

  console.log('result', result)
  return result?.data ?? 0
}
