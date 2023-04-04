import useSWR from 'swr'
import { TRADING_REWARD_API } from 'config/constants/endpoints'

const useAllActivatedTradingRewardPair = (): Array<string> => {
  const { data: allPairs } = useSWR('/all-activated-trading-reward-pair', async () => {
    const response = await fetch(`${TRADING_REWARD_API}/campaign/status/0`)
    const result = await response.json()

    const pairs = await Promise.all(
      result.data.map(async (campaignId: string) => {
        const pair = await fetch(`${TRADING_REWARD_API}/campaign/pair/campaignId/${campaignId}`)
        const pairResult = await pair.json()
        return pairResult.data
      }),
    )

    return pairs.flat().filter((value, index, self) => self.indexOf(value) === index)
  })

  return allPairs ?? []
}

export default useAllActivatedTradingRewardPair
