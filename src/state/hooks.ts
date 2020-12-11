import BigNumber from 'bignumber.js'
import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { fetchFarmsPublicDataAsync, fetchFarmUserDataAsync } from './actions'
import { State, Farm } from './types'

const ZERO = new BigNumber(0)

const useStateInit = () => {
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(fetchFarmsPublicDataAsync())
  }, [dispatch])
}

// Farms

export const useFarms = (): Farm[] => {
  const farms = useSelector((state: State) => state.farms.data)
  return farms
}

export const useFarmFromPid = (pid): Farm => {
  const farm = useSelector((state: State) => state.farms.data.find((f) => f.pid === pid))
  return farm
}

export const useFarmFromSymbol = (lpSymbol: string): Farm => {
  const farm = useSelector((state: State) => state.farms.data.find((f) => f.lpSymbol === lpSymbol))
  return farm
}

export const useFarmUser = (pid, account) => {
  const dispatch = useDispatch()
  const farm = useFarmFromPid(pid)

  useEffect(() => {
    if (!farm.userData && account) {
      dispatch(fetchFarmUserDataAsync(pid, account))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account, pid])

  return {
    allowance: farm.userData ? new BigNumber(farm.userData.allowance) : new BigNumber(0),
    tokenBalance: farm.userData ? new BigNumber(farm.userData.tokenBalance) : new BigNumber(0),
    stakedBalance: farm.userData ? new BigNumber(farm.userData.stakedBalance) : new BigNumber(0),
    earnings: farm.userData ? new BigNumber(farm.userData.earnings) : new BigNumber(0),
  }
}

// Pools

export const usePools = () => {
  const pools = useSelector((state: State) => state.pools.data)
  return pools
}

// Prices

export const usePriceBnbBusd = (): BigNumber => {
  const pid = 2 // BUSD-BNB LP
  const farm = useFarmFromPid(pid)
  return farm.tokenPriceVsQuote ? new BigNumber(1).div(farm.tokenPriceVsQuote) : ZERO
}

export const usePriceCakeBusd = (): BigNumber => {
  const pid = 1 // CAKE-BNB LP
  const bnbPriceUSD = usePriceBnbBusd()
  const farm = useFarmFromPid(pid)
  return farm.tokenPriceVsQuote ? bnbPriceUSD.times(farm.tokenPriceVsQuote) : ZERO
}

export default useStateInit
