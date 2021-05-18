// import { useEffect, useMemo } from 'react'
import { useEffect } from 'react'
import BigNumber from 'bignumber.js'
// import { useWeb3React } from '@web3-react/core'
import { useSelector } from 'react-redux'
import { useAppDispatch } from 'state'
// import { orderBy } from 'lodash'
// import { Team } from 'config/constants/types'
// import Nfts from 'config/constants/nfts'
import { getWeb3NoAccount } from 'utils/web3'
import { getAddress } from 'utils/addressHelpers'
import { getBalanceNumber } from 'utils/formatBalance'
import { BIG_ZERO } from 'utils/bigNumber'
import useRefresh from 'hooks/useRefresh'
import {
  fetchFarmsPublicDataAsync,
//  fetchPoolsPublicDataAsync,
//  fetchPoolsUserDataAsync,
//  fetchCakeVaultPublicData,
//  fetchCakeVaultUserData,
//  fetchCakeVaultFees,
  setBlock,
} from './actions'
// import { State, Farm, Pool, ProfileState, TeamsState, AchievementState, PriceState, FarmsState } from './types'
import { State, Farm, PriceState, FarmsState } from './types'
// import { fetchProfile } from './profile'
// import { fetchTeam, fetchTeams } from './teams'
// import { fetchAchievements } from './achievements'
import { fetchPrices } from './prices'
// import { fetchWalletNfts } from './collectibles'
// import { getCanClaim } from './predictions/helpers'
// import { transformPool } from './pools/helpers'
// import { fetchPoolsStakingLimitsAsync } from './pools'

export const useFetchPublicData = () => {
  const dispatch = useAppDispatch()
  const { slowRefresh } = useRefresh()
  useEffect(() => {
    dispatch(fetchFarmsPublicDataAsync())
//    dispatch(fetchPoolsPublicDataAsync())
//    dispatch(fetchPoolsStakingLimitsAsync())
  }, [dispatch, slowRefresh])

  useEffect(() => {
    const web3 = getWeb3NoAccount()
    const interval = setInterval(async () => {
      const blockNumber = await web3.eth.getBlockNumber()
      dispatch(setBlock(blockNumber))
    }, 6000)

    return () => clearInterval(interval)
  }, [dispatch])
}

// Farms

export const useFarms = (): FarmsState => {
  const farms = useSelector((state: State) => state.farms)
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

export const useFarmUser = (pid) => {
  const farm = useFarmFromPid(pid)

  return {
    allowance: farm.userData ? new BigNumber(farm.userData.allowance) : BIG_ZERO,
    tokenBalance: farm.userData ? new BigNumber(farm.userData.tokenBalance) : BIG_ZERO,
    stakedBalance: farm.userData ? new BigNumber(farm.userData.stakedBalance) : BIG_ZERO,
    earnings: farm.userData ? new BigNumber(farm.userData.earnings) : BIG_ZERO,
  }
}

export const useLpTokenPrice = (symbol: string) => {
  const farm = useFarmFromSymbol(symbol)
  const tokenPriceInUsd = useGetApiPrice(getAddress(farm.token.address))

  return farm.lpTotalSupply && farm.lpTotalInQuoteToken
    ? new BigNumber(getBalanceNumber(farm.lpTotalSupply)).div(farm.lpTotalInQuoteToken).times(tokenPriceInUsd).times(2)
    : BIG_ZERO
}



// Prices
export const useFetchPriceList = () => {
  const { slowRefresh } = useRefresh()
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(fetchPrices())
  }, [dispatch, slowRefresh])
}

export const useGetApiPrices = () => {
  const prices: PriceState['data'] = useSelector((state: State) => state.prices.data)
  return prices
}

export const useGetApiPrice = (address: string) => {
  const prices = useGetApiPrices()

  if (!prices) {
    return null
  }

  return prices[address.toLowerCase()]
}

// export const usePriceBnbBusd = (): BigNumber => {
//  const bnbBusdFarm = useFarmFromPid(2)
//  return bnbBusdFarm.tokenPriceVsQuote ? new BigNumber(1).div(bnbBusdFarm.tokenPriceVsQuote) : BIG_ZERO
// }

export const usePriceCakeBusd = (): BigNumber => {
  const cakeBnbFarm = useFarmFromPid(1)
//  const bnbBusdPrice = usePriceBnbBusd()

  const cakeBusdPrice = cakeBnbFarm.tokenPriceVsQuote ? cakeBnbFarm.tokenPriceVsQuote : BIG_ZERO

  return cakeBusdPrice
}

// Block
export const useBlock = () => {
  return useSelector((state: State) => state.block)
}

export const useInitialBlock = () => {
  return useSelector((state: State) => state.block.initialBlock)
}
