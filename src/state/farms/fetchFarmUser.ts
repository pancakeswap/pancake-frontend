import BigNumber from 'bignumber.js'
import erc20ABI from 'config/abi/erc20.json'
// import masterchefABI from 'config/abi/masterchef.json'
import GenericJarABI from 'config/abi/GenericJar.json'
import multicall from 'utils/multicall'
// import { getAddress, getMasterChefAddress } from 'utils/addressHelpers'
import { getAddress } from 'utils/addressHelpers'
import { FarmConfig } from 'config/constants/types'

export const fetchFarmUserAllowances = async (account: string, farmsToFetch: FarmConfig[]) => {
//  const masterChefAddress = getMasterChefAddress()

  const calls = farmsToFetch.map((farm) => {
    const lpContractAddress = getAddress(farm.lpAddresses)
    const jarContractAddress = getAddress(farm.jarAddresses)
    return { address: lpContractAddress, name: 'allowance', params: [account, jarContractAddress] }
  })

  const rawLpAllowances = await multicall(erc20ABI, calls)
  const parsedLpAllowances = rawLpAllowances.map((lpBalance) => {
    return new BigNumber(lpBalance).toJSON()
  })
  return parsedLpAllowances
}

export const fetchFarmUserTokenBalances = async (account: string, farmsToFetch: FarmConfig[]) => {
  const calls = farmsToFetch.map((farm) => {
    const lpContractAddress = getAddress(farm.lpAddresses)
    return {
      address: lpContractAddress,
      name: 'balanceOf',
      params: [account],
    }
  })

  const rawTokenBalances = await multicall(erc20ABI, calls)
  const parsedTokenBalances = rawTokenBalances.map((tokenBalance) => {
    return new BigNumber(tokenBalance).toJSON()
  })
  return parsedTokenBalances
}

export const fetchFarmUserStakedBalances = async (account: string, farmsToFetch: FarmConfig[]) => {
//  const masterChefAddress = getMasterChefAddress()

  const calls = farmsToFetch.map((farm) => {
    const jarContractAddress = getAddress(farm.jarAddresses)
    return {
      address: jarContractAddress,
      name: 'balanceOf',
      params: [account],
    }
  })

  const rawStakedBalances = await multicall(GenericJarABI, calls)
  const parsedStakedBalances = rawStakedBalances.map((stakedBalance) => {
    return new BigNumber(stakedBalance[0]._hex).toJSON()
  })
  return parsedStakedBalances
}

export const fetchFarmUserEarnings = async (account: string, farmsToFetch: FarmConfig[]) => {
//  const masterChefAddress = getMasterChefAddress()

  const calls = farmsToFetch.map((farm) => {
    const jarContractAddress = getAddress(farm.jarAddresses)
    return {
      address: jarContractAddress,
      name: 'balanceOf',
      params: [account],
    }
  })

  const rawEarnings = await multicall(GenericJarABI, calls)
  const parsedEarnings = rawEarnings.map((earnings) => {
    return new BigNumber(earnings).toJSON()
  })
  return parsedEarnings
}
