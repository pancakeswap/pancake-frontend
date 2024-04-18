import useActiveWeb3React from 'hooks/useActiveWeb3React'
import useFarmsWithBalance from 'views/Home/hooks/useFarmsWithBalance'
import BigNumber from 'bignumber.js'
import { useCakePrice } from 'hooks/useCakePrice'
import { useMemo } from 'react'

const useIsRenderUserBanner = () => {
  const { account } = useActiveWeb3React()

  const { earningsSum: farmEarningsSum } = useFarmsWithBalance()
  const cakePriceBusd = useCakePrice()
  const isEarningsBusdZero = new BigNumber(farmEarningsSum).multipliedBy(cakePriceBusd).isZero()

  return useMemo(() => {
    return { shouldRender: Boolean(account), isEarningsBusdZero }
  }, [account, isEarningsBusdZero])
}

export default useIsRenderUserBanner
