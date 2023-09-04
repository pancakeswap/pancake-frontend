import { ChainId } from '@pancakeswap/sdk'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import useFarmsWithBalance, { FarmWithBalance } from 'views/Home/hooks/useFarmsWithBalance'
import { usePriceCakeUSD } from 'state/farms/hooks'
import BigNumber from 'bignumber.js'
import { useMemo } from 'react'

const useIsRenderUserBanner = () => {
  const { chainId, account } = useActiveWeb3React()

  const { earningsSum: farmEarningsSum } = useFarmsWithBalance()
  const cakePriceBusd = usePriceCakeUSD()
  const isEarningsBusdZero = new BigNumber(farmEarningsSum).multipliedBy(cakePriceBusd).isZero()

  return useMemo(() => {
    return { shouldRender: Boolean(account) && chainId === ChainId.BSC, isEarningsBusdZero }
  }, [account, chainId, isEarningsBusdZero])
}

export default useIsRenderUserBanner
