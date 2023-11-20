import { ChainId } from '@pancakeswap/chains'
import { useQuery } from '@tanstack/react-query'
import { useCakeVaultContract } from 'hooks/useContract'
import useAccountActiveChain from 'hooks/useAccountActiveChain'
import dayjs from 'dayjs'

export const useCakePoolLocked = () => {
  const { chainId, account } = useAccountActiveChain()
  const cakeVaultContract = useCakeVaultContract()

  const { data: locked = false } = useQuery(
    ['cakePoolLocked', chainId, account],
    async () => {
      if (!account) return undefined
      const [, , , , , lockEndTime, , _locked] = await cakeVaultContract.read.userInfo([account])
      const lockEndTimeStr = lockEndTime.toString()

      return _locked && lockEndTimeStr !== '0' && dayjs.unix(parseInt(lockEndTimeStr, 10)).isAfter(dayjs())
    },
    {
      enabled: Boolean(account) && (chainId === ChainId.BSC || chainId === ChainId.BSC_TESTNET),
    },
  )
  return locked
}
