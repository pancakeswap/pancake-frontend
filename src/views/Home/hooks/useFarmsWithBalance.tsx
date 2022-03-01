import BigNumber from 'bignumber.js'
import { useWeb3React } from '@web3-react/core'
import multicall from 'utils/multicall'
import { getMasterChefAddress } from 'utils/addressHelpers'
import { EMPTY_ARRAY } from 'utils/constantObjects'
import masterChefABI from 'config/abi/masterchef.json'
import { farmsConfig, FAST_INTERVAL } from 'config/constants'
import { SerializedFarmConfig } from 'config/constants/types'
import { DEFAULT_TOKEN_DECIMAL } from 'config'
import useSWR from 'swr'
import { useFarmsPoolLength } from 'state/farms/hooks'

export interface FarmWithBalance extends SerializedFarmConfig {
  balance: BigNumber
}

const useFarmsWithBalance = () => {
  const { account } = useWeb3React()
  const poolLength = useFarmsPoolLength()

  const {
    data: { farmsWithStakedBalance, earningsSum } = {
      farmsWithStakedBalance: EMPTY_ARRAY as FarmWithBalance[],
      earningsSum: null,
    },
  } = useSWR(
    account && poolLength ? [account, 'farmsWithBalance'] : null,
    async () => {
      const farmsCanFetch = farmsConfig.filter((f) => poolLength > f.pid)
      const calls = farmsCanFetch.map((farm) => ({
        address: getMasterChefAddress(),
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
