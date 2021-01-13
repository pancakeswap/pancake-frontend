import BigNumber from 'bignumber.js'
import erc20ABI from 'config/abi/erc20.json'
import masterchefABI from 'config/abi/masterchef.json'
import multicall from 'utils/multicall'
import { getMasterChefAddress } from 'utils/addressHelpers'
import farmsConfig from 'config/constants/farms'

const CHAIN_ID = process.env.REACT_APP_CHAIN_ID

const fetchFarmUser = async (pid: number, account: string) => {
  const farm = farmsConfig.find((f) => f.pid === pid)
  const masterChefAdress = getMasterChefAddress()
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

export default fetchFarmUser
