import BigNumber from 'bignumber.js'
import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { updateFarmPublicDataAsync } from './actions'
import { State } from './types'

const ZERO = new BigNumber(0)

const useStateInit = () => {
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(updateFarmPublicDataAsync())
  }, [dispatch])
}

export const useFarms = () => {
  const farms = useSelector((state: State) => state.farms.data)
  return farms
}

export const useFarmFromPid = (pid) => {
  const farm = useSelector((state: State) => state.farms.data.find((f) => f.pid === pid))
  return farm
}

export const useFarmFromSymbol = (lpSymbol: string) => {
  const farm = useSelector((state: State) => state.farms.data.find((f) => f.lpSymbol === lpSymbol))
  return farm
}

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
