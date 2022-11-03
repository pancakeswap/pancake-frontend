import { useSendTransaction, useSimulateTransaction } from '@pancakeswap/awgmi'
import { SmartChef } from 'contracts/smartchef'
import { getFullDecimalMultiplier } from '@pancakeswap/utils/getFullDecimalMultiplier'
import BigNumber from 'bignumber.js'

export default function useStakePool({ stakingTokenAddress, earningTokenAddress, sousId, stakingTokenDecimals }) {
  const { simulateTransactionAsync } = useSimulateTransaction()
  const { sendTransactionAsync } = useSendTransaction()

  return {
    onUnstake: async (amount) => {
      const stakeAmount = new BigNumber(amount).times(getFullDecimalMultiplier(stakingTokenDecimals)).toString()

      const payload = SmartChef.withdraw({
        amount: stakeAmount,
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
