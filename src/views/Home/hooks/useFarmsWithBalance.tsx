import BigNumber from 'bignumber.js'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import multicall from 'utils/multicall'
import { getMasterChefAddress } from 'utils/addressHelpers'
import masterChefABI from 'config/abi/masterchef.json'
import { FAST_INTERVAL } from 'config/constants'
import { SerializedFarmConfig } from 'config/constants/types'
import { DEFAULT_TOKEN_DECIMAL } from 'config'
import useSWR from 'swr'
import { useFarmsLength } from 'state/farms/hooks'
import { getFarmConfig } from '@pancakeswap/farm-constants'

export interface FarmWithBalance extends SerializedFarmConfig {
  balance: BigNumber
}

const useFarmsWithBalance = () => {
  const { account, chainId } = useActiveWeb3React()
  const { data: poolLength } = useFarmsLength()

  const {
    data: { farmsWithStakedBalance, earningsSum } = {
      farmsWithStakedBalance: [] as FarmWithBalance[],
      earningsSum: null,
    },
  } = useSWR(
    account && poolLength && chainId ? [account, 'farmsWithBalance', chainId, poolLength] : null,
    async () => {
      const farmsConfig = await getFarmConfig(chainId)
      const farmsCanFetch = farmsConfig.filter((f) => poolLength > f.pid)
      const calls = farmsCanFetch.map((farm) => ({
        address: getMasterChefAddress(chainId),
        name: 'pendingCake',
        params: [farm.pid, account],
      }))

      const rawResults = await multicall(masterChefABI, calls)
      const results = farmsCanFetch.map((farm, index) => ({ ...farm, balance: new BigNumber(rawResults[index]) }))
      const farmsWithBalances: FarmWithBalance[] = results.filter((balanceType) => balanceType.balance.gt(0))
      const totalEarned = farmsWithBalances.reduce((accum, earning) => {
        const earningNumber = new BigNumber(earning.balance)
        if (earningNumber.eq(0)) {
          return accum
        }
        return accum + earningNumber.div(DEFAULT_TOKEN_DECIMAL).toNumber()
      }, 0)

      return {
        farmsWithStakedBalance: farmsWithBalances,
        earningsSum: totalEarned,
      }
    },
    { refreshInterval: FAST_INTERVAL },
  )

  return { farmsWithStakedBalance, earningsSum }
}

export default useFarmsWithBalance
