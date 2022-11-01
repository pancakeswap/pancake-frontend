import { useSendTransaction, useSimulateTransaction } from '@pancakeswap/awgmi'
import { SmartChef } from '@pancakeswap/aptos-swap-sdk'

export default function useHarvestPool({ stakingTokenAddress, earningTokenAddress, sousId }) {
  const { simulateTransactionAsync } = useSimulateTransaction()
  const { sendTransactionAsync } = useSendTransaction()

  return {
    onReward: async () => {
      const payload = SmartChef.deposit({
        amount: '0',
        uid: sousId,
        stakeTokenAddress: stakingTokenAddress,
        rewardTokenAddress: earningTokenAddress,
      })

      console.info('payload: ', payload)

      let results

      try {
        results = await simulateTransactionAsync({ payload })
      } catch (error) {
        // ignore error
      }

      const options = Array.isArray(results) ? { max_gas_amount: results[0].max_gas_amount } : undefined

      const res = await sendTransactionAsync({
        payload,
        options,
      })

      return {
        hash: res.hash,
        wait: () => ({
          success: true,
          hash: res.hash,
        }),
      }
    },
  }
}
