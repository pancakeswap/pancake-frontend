import { ChainId } from '@pancakeswap/chains'
import { useQuery } from '@tanstack/react-query'
import dayjs from 'dayjs'
import useAccountActiveChain from 'hooks/useAccountActiveChain'
import { useCakeVaultContract } from 'hooks/useContract'
import { useCurrentBlockTimestamp } from './useCurrentBlockTimestamp'

export type CakePoolInfo = {
  shares: bigint
  lastDepositedTime: bigint
  cakeAtLastUserAction: bigint
  lastUserActionTime: bigint
  lockStartTime: bigint
  lockEndTime: bigint
  userBoostedShare: bigint
  locked: boolean
  lockedAmount: bigint
}

export const useCakePoolLockInfo = () => {
  const { chainId, account } = useAccountActiveChain()
  const cakeVaultContract = useCakeVaultContract()
  const currentTimestamp = useCurrentBlockTimestamp()

  const { data: info } = useQuery({
    queryKey: ['cakePoolLockInfo', cakeVaultContract.address, chainId, account],

    queryFn: async (): Promise<CakePoolInfo> => {
      if (!account) return {} as CakePoolInfo
      const [
        shares,
        lastDepositedTime,
        cakeAtLastUserAction,
        lastUserActionTime,
        lockStartTime,
        lockEndTime,
        userBoostedShare,
        _locked,
        lockedAmount,
      ] = await cakeVaultContract.read.userInfo([account])
      const lockEndTimeStr = lockEndTime.toString()
      return {
        shares,
        lastDepositedTime,
        cakeAtLastUserAction,
        lastUserActionTime,
        lockStartTime,
        lockEndTime,
        userBoostedShare,
        locked:
          _locked &&
          lockEndTimeStr !== '0' &&
          dayjs.unix(parseInt(lockEndTimeStr, 10)).isAfter(dayjs.unix(currentTimestamp)),
        lockedAmount,
      }
    },

    enabled: Boolean(account) && (chainId === ChainId.BSC || chainId === ChainId.BSC_TESTNET),
  })
  return info || ({} as CakePoolInfo)
}
