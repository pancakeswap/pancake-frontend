import { ChainId } from '@pancakeswap/chains'
import { v3InfoClients } from 'utils/graphql'
import { fetchedTokenDatas } from 'views/V3Info/data/token/tokenData'

export const fetchAceTokenPrice = async (tokenAddress: string) => {
  const result = await fetchedTokenDatas(v3InfoClients[ChainId.BSC], [tokenAddress])

  console.log('result', result?.data)

  // .priceUSD

  // fetchTokenPriceData(
  //   tokenAddress,
  //   ONE_HOUR_SECONDS,
  //   startTimestamp,
  //   v3InfoClients[ChainId.BSC],
  //   'BSC',
  //   SUBGRAPH_START_BLOCK[ChainId.BSC],
  // )

  return result?.data?.data?.[tokenAddress] ?? 0
}
