import { useQuery } from '@tanstack/react-query'
import { SLOW_INTERVAL } from 'config/constants'
import useAccountActiveChain from 'hooks/useAccountActiveChain'
import { useVeCakeContract } from 'hooks/useContract'
import { Address } from 'viem'

export type VeCakeUserInfo = {
  amount: bigint
  end: bigint
  cakePoolProxy: Address
  cakeAmount: bigint
  lockEndTime: number
  migrationTime: number
  cakePoolType: number
  withdrawFlag: number
}

export const useVeCakeUserInfo = (): VeCakeUserInfo | undefined => {
  const veCakeContract = useVeCakeContract()
  const { account } = useAccountActiveChain()

  const { data } = useQuery(
    ['veCakeUserInfo', veCakeContract?.address, account],
    async () => {
      if (!account) return undefined

      const [amount, end, cakePoolProxy, cakeAmount, lockEndTime, migrationTime, cakePoolType, withdrawFlag] =
        await veCakeContract.read.getUserInfo([account])
      return {
        amount,
        end,
        cakePoolProxy,
        cakeAmount,
        lockEndTime,
        migrationTime,
        cakePoolType,
        withdrawFlag,
      } as VeCakeUserInfo
    },
    {
      enabled: Boolean(veCakeContract?.address && account),
      refetchInterval: SLOW_INTERVAL,
      keepPreviousData: true,
    },
  )

  return data
}
