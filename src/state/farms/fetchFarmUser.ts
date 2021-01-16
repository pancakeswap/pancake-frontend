import BigNumber from 'bignumber.js'
import erc20ABI from 'sushi/lib/abi/erc20.json'
import masterchefABI from 'sushi/lib/abi/masterchef.json'
import multicall from 'utils/multicall'
import farmsConfig from 'sushi/lib/constants/farms'
import addresses from 'sushi/lib/constants/contracts'

const CHAIN_ID = process.env.REACT_APP_CHAIN_ID

export const fetchFarmUserAllowances = async (account: string) => {
  const masterChefAdress = addresses.masterChef[CHAIN_ID]

  const calls = farmsConfig.map((farm) => {
    const lpContractAddress = farm.lpAddresses[CHAIN_ID]
    return { address: lpContractAddress, name: 'allowance', params: [account, masterChefAdress] }
  })

  const rawLpAllowances = await multicall(erc20ABI, calls)
  const parsedLpAllowances = rawLpAllowances.map((lpBalance) => {
    return new BigNumber(lpBalance).toJSON()
  })
  return parsedLpAllowances
}

export const fetchFarmUserTokenBalances = async (account: string) => {
  const calls = farmsConfig.map((farm) => {
    const lpContractAddress = farm.lpAddresses[CHAIN_ID]
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

export const fetchFarmUserStakedBalances = async (account: string) => {
  const masterChefAdress = addresses.masterChef[CHAIN_ID]

  const calls = farmsConfig.map((farm, index) => {
    return {
      address: masterChefAdress,
      name: 'userInfo',
      params: [index, account],
    }
  })

  const rawStakedBalances = await multicall(masterchefABI, calls)
  const parsedStakedBalances = rawStakedBalances.map((stakedBalance) => {
    return new BigNumber(stakedBalance[0]._hex).toJSON()
  })
  return parsedStakedBalances
}

export const fetchFarmUserEarnings = async (account: string) => {
  const masterChefAdress = addresses.masterChef[CHAIN_ID]

  const calls = farmsConfig.map((farm, index) => {
    return {
      address: masterChefAdress,
      name: 'pendingCake',
      params: [index, account],
    }
  })

  const rawEarnings = await multicall(masterchefABI, calls)
  const parsedEarnings = rawEarnings.map((earnings) => {
    return new BigNumber(earnings).toJSON()
  })
  return parsedEarnings
}

export const fetchFarmUser = async (pid: number, account: string) => {
  const farm = farmsConfig.find((f) => f.pid === pid)
  const masterChefAdress = addresses.masterChef[CHAIN_ID]
  const lpContractAddress = farm.lpAddresses[CHAIN_ID]

  const [allowance, tokenBalance] = await multicall(erc20ABI, [
    // Allowance
    {
      address: lpContractAddress,
      name: 'allowance',
      params: [account, masterChefAdress],
    },
    // LP token balance on user account
    {
      address: lpContractAddress,
      name: 'balanceOf',
      params: [account],
    },
  ])
  const [userInfo, earnings] = await multicall(masterchefABI, [
    // stakedBalance
    {
      address: masterChefAdress,
      name: 'userInfo',
      params: [pid, account],
    },
    // earnings
    {
      address: masterChefAdress,
      name: 'pendingCake',
      params: [pid, account],
    },
  ])

  return {
    allowance: new BigNumber(allowance).toJSON(),
    tokenBalance: new BigNumber(tokenBalance).toJSON(),
    stakedBalance: new BigNumber(userInfo[0]._hex).toJSON(),
    earnings: new BigNumber(earnings).toJSON(),
  }
}
