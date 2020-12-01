import { useEffect, useState } from 'react'
import BigNumber from 'bignumber.js'
import { useWallet } from 'use-wallet'
import { provider } from 'web3-core'
import { getBalanceNumber } from '../utils/formatBalance'
import { getTokenBalance } from '../utils/erc20'
import { getSushiSupply } from '../sushi/utils'
import useBlock from './useBlock'
import useSushi from './useSushi'

const useTokenBalance = (tokenAddress: string) => {
  const [balance, setBalance] = useState(new BigNumber(0))
  const { account, ethereum }: { account: string; ethereum: provider } = useWallet()
  const block = useBlock()

  useEffect(() => {
    const fetchBalance = async () => {
      const res = await getTokenBalance(ethereum, tokenAddress, account)
      setBalance(new BigNumber(res))
    }

    if (account && ethereum) {
      fetchBalance()
    }
  }, [account, ethereum, setBalance, block, tokenAddress])

  return balance
}

export const useTotalSupply = () => {
  const sushi = useSushi()
  const block = useBlock()
  const [totalSupply, setTotalSupply] = useState<BigNumber>()

  useEffect(() => {
    async function fetchTotalSupply() {
      const supply = await getSushiSupply(sushi)
      setTotalSupply(supply)
    }
    if (sushi) {
      fetchTotalSupply()
    }
  }, [block, sushi, setTotalSupply])

  return totalSupply
}

export const useBurnedBalance = (tokenAddress: string) => {
  const [balance, setBalance] = useState(new BigNumber(0))
  const { account, ethereum }: { account: string; ethereum: provider } = useWallet()
  const block = useBlock()

  useEffect(() => {
    const fetchBalance = async () => {
      const res = await getTokenBalance(ethereum, tokenAddress, '0x000000000000000000000000000000000000dEaD')
      setBalance(new BigNumber(res))
    }

    if (account && ethereum) {
      fetchBalance()
    }
  }, [account, ethereum, setBalance, block, tokenAddress])

  return balance
}

export const useTokenBalance2 = (tokenAddress: string, account2: string) => {
  const [balance, setBalance] = useState(0)
  const { account, ethereum }: { account: string; ethereum: provider } = useWallet()
  const block = useBlock()

  useEffect(() => {
    const fetchBalance = async () => {
      const res = await getTokenBalance(ethereum, tokenAddress, account2)
      setBalance(getBalanceNumber(new BigNumber(res)))
    }

    if (account && ethereum) {
      fetchBalance()
    }
  }, [account, ethereum, setBalance, block, tokenAddress, account2])

  return balance
}

export default useTokenBalance
