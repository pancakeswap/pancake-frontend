import BigNumber from 'bignumber.js'
import erc20ABI from 'sushi/lib/abi/erc20.json'
import masterchefABI from 'sushi/lib/abi/masterchef.json'
import multicall from 'utils/multicall'
import farmsConfig from 'sushi/lib/constants/farms'
import addresses from 'sushi/lib/constants/contracts'

const CHAIN_ID = process.env.REACT_APP_CHAIN_ID

const fetchFarmUser = async (pid: number, account: string) => {
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
    allowance: new BigNumber(allowance).toNumber(),
    tokenBalance: new BigNumber(tokenBalance).toNumber(),
    // eslint-disable-next-line no-underscore-dangle
    stakedBalance: new BigNumber(userInfo[0]._hex).toNumber(),
    earnings: new BigNumber(earnings).toNumber(),
  }
}

export default fetchFarmUser
