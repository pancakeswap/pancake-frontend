import BigNumber from 'bignumber.js'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import multicall from 'utils/multicall'
import masterChefABI from 'config/abi/masterchef.json'
import { FAST_INTERVAL } from 'config/constants'
import { SerializedFarmConfig } from 'config/constants/types'
import { DEFAULT_TOKEN_DECIMAL } from 'config'
import useSWR from 'swr'
import useSWRImmutable from 'swr/immutable'
import { useFarmsLength } from 'state/farms/hooks'
import { getFarmConfig } from '@pancakeswap/farms/constants'
import { useBCakeProxyContract, useMasterchef } from 'hooks/useContract'
import { Masterchef, BCakeProxy } from 'config/abi/types'
import { useBCakeProxyContractAddress } from '../../Farms/hooks/useBCakeProxyContractAddress'
import splitProxyFarms from '../../Farms/components/YieldBooster/helpers/splitProxyFarms'

export type FarmWithBalance = {
  balance: BigNumber
  contract: Masterchef | BCakeProxy
} & SerializedFarmConfig

const useFarmsWithBalance = () => {
  const { account, chainId } = useActiveWeb3React()
  const { data: poolLength } = useFarmsLength()
  const { proxyAddress } = useBCakeProxyContractAddress(account, chainId)
  const bCakeProxy = useBCakeProxyContract(proxyAddress)
  const masterChefContract = useMasterchef()

  const getFarmsWithBalances = async (
    farms: SerializedFarmConfig[],
    accountToCheck: string,
    contract: Masterchef | BCakeProxy,
  ) => {
    const calls = farms.map((farm) => ({
      address: masterChefContract.address,
      name: 'pendingCake',
      params: [farm.pid, accountToCheck],
    }))

    const rawResults = await multicall(masterChefABI, calls)
    const results = farms.map((farm, index) => ({ ...farm, balance: new BigNumber(rawResults[index]) }))
    const farmsWithBalances: FarmWithBalance[] = results
      .filter((balanceType) => balanceType.balance.gt(0))
      .map((farm) => ({
        ...farm,
        contract,
      }))
    const totalEarned = farmsWithBalances.reduce((accum, earning) => {
      const earningNumber = new BigNumber(earning.balance)
      if (earningNumber.eq(0)) {
        return accum
      }
      return accum + earningNumber.div(DEFAULT_TOKEN_DECIMAL).toNumber()
    }, 0)
    return { farmsWithBalances, totalEarned }
  }

  const { data: farmsCanFetch } = useSWRImmutable(
    chainId && poolLength ? ['farmsCanFetch', chainId, poolLength] : null,
    async () => {
      const farmsConfig = await getFarmConfig(chainId)
      return farmsConfig.filter((f) => poolLength > f.pid)
    },
  )

  const {
    data: { normalFarmsWithStakedBalance, normalEarningsSum } = {
      normalFarmsWithStakedBalance: [] as FarmWithBalance[],
      normalEarningsSum: null,
    },
  } = useSWR(
    account && farmsCanFetch?.length ? [account, 'normalFarmsWithBalance', chainId, farmsCanFetch] : null,
    async () => {
      const normalBalances = await getFarmsWithBalances(farmsCanFetch, account, masterChefContract)
      return {
        normalFarmsWithStakedBalance: normalBalances.farmsWithBalances,
        normalEarningsSum: normalBalances.totalEarned,
      }
    },
    { refreshInterval: FAST_INTERVAL },
  )

  const {
    data: { proxyFarmsWithStakedBalance, proxyEarningsSum } = {
      proxyFarmsWithStakedBalance: [] as FarmWithBalance[],
      proxyEarningsSum: null,
    },
  } = useSWR(
    account && farmsCanFetch?.length && proxyAddress
      ? [account, 'proxyFarmsWithBalance', chainId, farmsCanFetch]
      : null,
    async () => {
      const { farmsWithProxy } = splitProxyFarms(farmsCanFetch)
      const proxyBalances = await getFarmsWithBalances(farmsWithProxy, proxyAddress, bCakeProxy)
      return {
        proxyFarmsWithStakedBalance: proxyBalances.farmsWithBalances,
        proxyEarningsSum: proxyBalances.totalEarned,
      }
    },
    { refreshInterval: FAST_INTERVAL },
  )

  return {
    farmsWithStakedBalance: [...normalFarmsWithStakedBalance, ...proxyFarmsWithStakedBalance],
    earningsSum: normalEarningsSum + proxyEarningsSum,
  }
}

export default useFarmsWithBalance
