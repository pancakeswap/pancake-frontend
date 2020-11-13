import { useCallback, useEffect, useState } from 'react'

import BigNumber from 'bignumber.js'
import { useWallet } from 'use-wallet'
import { provider } from 'web3-core'
import { getBalanceNumber } from '../utils/formatBalance'

import { getBalance } from '../utils/erc20'
import { getSushiSupply } from '../sushi/utils'
import useBlock from './useBlock'
import useSushi from './useSushi'

const useTokenBalance = (tokenAddress: string) => {
  const [balance, setBalance] = useState(new BigNumber(0))
  const { account, ethereum }: { account: string; ethereum: provider } = useWallet()
  const block = useBlock()

  const fetchBalance = useCallback(async () => {
    const balance = await getBalance(ethereum, tokenAddress, account)
    setBalance(new BigNumber(balance))
  }, [account, ethereum, tokenAddress])

  useEffect(() => {
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

  const fetchBalance = useCallback(async () => {
    const balance = await getBalance(ethereum, tokenAddress, '0x000000000000000000000000000000000000dEaD')
    setBalance(new BigNumber(balance))
  }, [account, ethereum, tokenAddress])

  useEffect(() => {
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

  const fetchBalance = useCallback(async () => {
    const balance = await getBalance(ethereum, tokenAddress, account2)
    setBalance(getBalanceNumber(new BigNumber(balance)))
  }, [account, ethereum, tokenAddress])

  useEffect(() => {
    if (account && ethereum) {
      fetchBalance()
    }
  }, [account, ethereum, setBalance, block, tokenAddress])

  return balance
}

export const useBnbPrice = () => {
  const [price, setPrice] = useState(0)
  const { account, ethereum }: { account: string; ethereum: provider } = useWallet()
  const block = useBlock()

  const fetchBalance = useCallback(async () => {
    const busd = await getBalance(
      ethereum,
      '0xe9e7cea3dedca5984780bafc599bd69add087d56',
      '0x1B96B92314C44b159149f7E0303511fB2Fc4774f',
    )
    const bnb = await getBalance(
      ethereum,
      '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
      '0x1B96B92314C44b159149f7E0303511fB2Fc4774f',
    )
    setPrice(getBalanceNumber(new BigNumber(busd)) / getBalanceNumber(new BigNumber(bnb)))
  }, [account, ethereum])

  useEffect(() => {
    if (account && ethereum) {
      fetchBalance()
    }
  }, [account, ethereum, setPrice, block])

  return price
}

export const useCakePrice = () => {
  const [price, setPrice] = useState(0)
  const { account, ethereum }: { account: string; ethereum: provider } = useWallet()
  const block = useBlock()

  const fetchBalance = useCallback(async () => {
    const busd = await getBalance(
      ethereum,
      '0xe9e7cea3dedca5984780bafc599bd69add087d56',
      '0x1B96B92314C44b159149f7E0303511fB2Fc4774f',
    )
    const bnb0 = await getBalance(
      ethereum,
      '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
      '0x1B96B92314C44b159149f7E0303511fB2Fc4774f',
    )
    const bnbPrice = getBalanceNumber(new BigNumber(busd)) / getBalanceNumber(new BigNumber(bnb0))

    const cake = await getBalance(
      ethereum,
      '0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82',
      '0xA527a61703D82139F8a06Bc30097cC9CAA2df5A6',
    )
    const bnb1 = await getBalance(
      ethereum,
      '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
      '0xA527a61703D82139F8a06Bc30097cC9CAA2df5A6',
    )
    const cakebnb = getBalanceNumber(new BigNumber(bnb1)) / getBalanceNumber(new BigNumber(cake))

    const cakePrice = cakebnb * bnbPrice

    setPrice(cakePrice)
  }, [account, ethereum])

  useEffect(() => {
    if (account && ethereum) {
      fetchBalance()
    }
  }, [account, ethereum, setPrice, block])

  return price
}

// export const getBnbPrice = () => {
//   const [price, setPrice] = useState(new BigNumber(0))
//   const {
//     account,
//     ethereum,
//   }: { account: string; ethereum: provider } = useWallet()
//   const block = useBlock()

//   const fetchBalance = useCallback(async () => {
//     const bnb = await getBalance(ethereum, '0xe9e7cea3dedca5984780bafc599bd69add087d56', '0x1B96B92314C44b159149f7E0303511fB2Fc4774f')
//     const busd = await getBalance(ethereum, '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c', '0x1B96B92314C44b159149f7E0303511fB2Fc4774f')
//     setPrice(new BigNumber(busd).div(new BigNumber(bnb)))
//   }, [account, ethereum])

//   useEffect(() => {
//     if (account && ethereum) {
//       fetchBalance()
//     }
//   }, [account, ethereum, setPrice, block])

//   return price
// }

export default useTokenBalance
