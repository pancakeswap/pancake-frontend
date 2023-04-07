import useSWR from 'swr'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { TRADING_REWARD_API } from 'config/constants/endpoints'

const useAllActivatedTradingRewardPair = (): Array<string> => {
  const { chainId } = useActiveChainId()

  const { data: allPairs } = useSWR(chainId && ['/all-activated-trading-reward-pair', chainId], async () => {
    // status 0: all, 1: activated, 2: inactivated
    const response = await fetch(`${TRADING_REWARD_API}/campaign/status/0/chainId/${chainId}`)
    const result = await response.json()

    const pairs = await Promise.all(
      result.data.map(async (campaignId: string) => {
        const pair = await fetch(`${TRADING_REWARD_API}/campaign/pair/chainId/${chainId}/campaignId/${campaignId}`)
        const pairResult = await pair.json()
        return pairResult.data
      }),
    )

    return pairs.flat().filter((value, index, self) => self.indexOf(value) === index)
  })

  return allPairs ?? []
}

export default useAllActivatedTradingRewardPair
