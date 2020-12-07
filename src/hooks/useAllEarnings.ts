import { useEffect, useState } from 'react'
import { useWallet } from 'use-wallet'
import multicall from 'utils/multicall'
import masterChefABI from 'sushi/lib/abi/masterchef.json'
import addresses from 'sushi/lib/constants/contracts'
import { farmsConfig } from 'sushi/lib/constants'
import useBlock from './useBlock'

const useAllEarnings = () => {
  const [balances, setBalance] = useState([])
  const { account }: { account: string } = useWallet()
  const block = useBlock()

  useEffect(() => {
    const fetchAllBalances = async () => {
      const calls = farmsConfig.map((farm) => ({
        address: addresses.masterChef[56],
        name: 'pendingCake',
        params: [farm.pid, account],
      }))

      const res = await multicall(masterChefABI, calls)

      setBalance(res)
    }

    if (account) {
      fetchAllBalances()
    }
  }, [account, block])

  return balances
}

export default useAllEarnings
