import { useState, useEffect } from 'react'
import BigNumber from 'bignumber.js'
import { useWallet } from 'use-wallet'
import multicall from 'utils/multicall'
import erc20ABI from 'sushi/lib/abi/erc20.json'
import masterchefABI from 'sushi/lib/abi/masterchef.json'
import contractsAdresses from 'sushi/lib/constants/contracts'

interface UserFarm {
  allowance?: BigNumber
  tokenBalance: BigNumber
  stakedBalance: BigNumber
  earnings: BigNumber
}

const useUserFarm = (lpContractAddress, pid): UserFarm => {
  const [state, setState] = useState({
    allowance: null,
    tokenBalance: new BigNumber(0),
    stakedBalance: new BigNumber(0),
    earnings: new BigNumber(0),
  })
  const { account } = useWallet()
  useEffect(() => {
    const fetch = async () => {
      const masterChefAdress = contractsAdresses.masterChef[process.env.REACT_APP_CHAIN_ID]
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

      setState({
        allowance: new BigNumber(allowance),
        tokenBalance: new BigNumber(tokenBalance),
        // eslint-disable-next-line no-underscore-dangle
        stakedBalance: new BigNumber(new BigNumber(userInfo[0]._hex).toNumber()),
        earnings: new BigNumber(earnings),
      })
    }
    if (account && lpContractAddress) {
      fetch()
    }
  }, [account, lpContractAddress, pid])

  return state
}

export default useUserFarm
