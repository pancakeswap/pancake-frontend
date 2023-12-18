import { ChainId } from '@pancakeswap/chains'
import { getBlocksFromTimestamps } from 'utils/getBlocksFromTimestamps'
import { getDeltaTimestamps } from 'utils/getDeltaTimestamps'
import { v3InfoClients } from 'utils/graphql'
import { SUBGRAPH_START_BLOCK } from 'views/V3Info/constants'
import { fetchedTokenDatas } from 'views/V3Info/data/token/tokenData'

export const fetchAceTokenPrice = async (tokenAddress: string) => {
  const [t24, t48, t7d] = getDeltaTimestamps()
  const timestampsString = JSON.stringify([t24, t48, t7d])
  const timestampsArray = JSON.parse(timestampsString)

  const blocks = await getBlocksFromTimestamps(timestampsArray, 'desc', 1000, 'BSC')

  const result = await fetchedTokenDatas(
    v3InfoClients[ChainId.BSC],
    [tokenAddress.toLowerCase()],
    blocks?.filter((d) => d.number >= SUBGRAPH_START_BLOCK[ChainId.BSC]),
  )

  return result?.data?.[tokenAddress?.toLowerCase()]?.priceUSD ?? 0
}
