import useSWR from 'swr'
import { useAccount } from 'wagmi'
import { TRADING_REWARD_API } from 'config/constants/endpoints'

const initialState = {
  claimedRebate: false,
  claimedTopTraders: false,
}

const useTradingFeeClaimedRecord = () => {
  const { address: account } = useAccount()

  const { data } = useSWR(
    account && ['/trading-fee-claimed-record', account],
    async () => {
      try {
        // const response = await fetch(`${TRADING_REWARD_API}/campaign/address/${account}`)
        // const result = await response.json()
        // return result.data
        return initialState
      } catch (error) {
        console.info(`Fetch Trading Fee Claimed Record Error: ${error}`)
        return initialState
      }
    },
    {
      revalidateOnFocus: false,
      revalidateIfStale: false,
      revalidateOnReconnect: false,
      revalidateOnMount: true,
      fallbackData: initialState,
    },
  )

  return data
}

export default useTradingFeeClaimedRecord
