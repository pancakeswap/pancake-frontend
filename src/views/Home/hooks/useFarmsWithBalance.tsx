import { useState } from 'react'
import BigNumber from 'bignumber.js'
import { useWeb3React } from '@web3-react/core'
import multicall from 'utils/multicall'
import { getMasterChefAddress } from 'utils/addressHelpers'
import masterChefABI from 'config/abi/masterchef.json'
import { farmsConfig } from 'config/constants'
import { SerializedFarmConfig } from 'config/constants/types'
import { DEFAULT_TOKEN_DECIMAL } from 'config'
import { useFastRefreshEffect } from 'hooks/useRefreshEffect'

export interface FarmWithBalance extends SerializedFarmConfig {
  balance: BigNumber
}

const useFarmsWithBalance = () => {
  const [farmsWithStakedBalance, setFarmsWithStakedBalance] = useState<FarmWithBalance[]>([])
  const [earningsSum, setEarningsSum] = useState<number>(null)
  const { account } = useWeb3React()

  useFastRefreshEffect(() => {
    const fetchBalances = async () => {
      const calls = farmsConfig.map((farm) => ({
        address: getMasterChefAddress(),
        name: 'pendingCake',
        params: [farm.pid, account],
      }))

      const rawResults = await multicall(masterChefABI, calls)
      const results = farmsConfig.map((farm, index) => ({ ...farm, balance: new BigNumber(rawResults[index]) }))
      const farmsWithBalances = results.filter((balanceType) => balanceType.balance.gt(0))
      const totalEarned = farmsWithBalances.reduce((accum, earning) => {
        const earningNumber = new BigNumber(earning.balance)
        if (earningNumber.eq(0)) {
          return accum
        }
        return accum + earningNumber.div(DEFAULT_TOKEN_DECIMAL).toNumber()
      }, 0)

      setFarmsWithStakedBalance(farmsWithBalances)
      setEarningsSum(totalEarned)
    }

    if (account) {
      fetchBalances()
    }
  }, [account])

  return { farmsWithStakedBalance, earningsSum }
}

export default useFarmsWithBalance
