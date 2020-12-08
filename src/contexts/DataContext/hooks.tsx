import BigNumber from 'bignumber.js'
import { useContext } from 'react'
import { DataContext } from './DataContext'

const ZERO = new BigNumber(0)

const useDataProvider = () => {
  const { data } = useContext(DataContext)
  return data
}

const useFarmsLP = () => {
  const { data } = useContext(DataContext)
  return data.farms
}

const useFarmLP = (lpSymbol: string) => {
  const { data } = useContext(DataContext)
  return data.farms.find((farm) => farm.lpSymbol === lpSymbol)
}

const useFarmID = (pid: number) => {
  const { data } = useContext(DataContext)
  return data.farms.find((farm) => farm.pid === pid)
}

const usePriceBnbBusd = (): BigNumber => {
  const pid = 2 // BUSD-BNB LP
  const farm = useFarmID(pid)
  return farm.tokenPriceVsQuote ? new BigNumber(1).div(farm.tokenPriceVsQuote) : ZERO
}

const usePriceCakeBusd = () => {
  const pid = 1 // CAKE-BNB LP
  const bnbPriceUSD = usePriceBnbBusd()
  const farm = useFarmID(pid)
  return farm.tokenPriceVsQuote ? farm.tokenPriceVsQuote.times(bnbPriceUSD) : ZERO
}

export { useDataProvider, useFarmsLP, useFarmLP, usePriceBnbBusd, usePriceCakeBusd }
