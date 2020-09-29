import { useCallback, useEffect, useState } from 'react'
import { provider } from 'web3-core'

import BigNumber from 'bignumber.js'
import { useWallet } from 'use-wallet'

import { getEarned, getSousEarned, getSousChefContract, getMasterChefContract, getSousEndBlock, getSousStartBlock } from '../sushi/utils'
import useSushi from './useSushi'
import useBlock from './useBlock'

const useEarnings = (pid: number) => {
  const [balance, setBalance] = useState(new BigNumber(0))
  const {
    account,
    ethereum,
  }: { account: string; ethereum: provider } = useWallet()
  const sushi = useSushi()
  const masterChefContract = getMasterChefContract(sushi)
  const block = useBlock()

  const fetchBalance = useCallback(async () => {
    const balance = await getEarned(masterChefContract, pid, account)
    setBalance(new BigNumber(balance))
  }, [account, masterChefContract, sushi])

  useEffect(() => {
    if (account && masterChefContract && sushi) {
      fetchBalance()
    }
  }, [account, block, masterChefContract, setBalance, sushi])

  return balance
}

export const useSousEarnings = () => {
  const [balance, setBalance] = useState(new BigNumber(0))
  const {
    account,
    ethereum,
  }: { account: string; ethereum: provider } = useWallet()
  const sushi = useSushi()
  const sousChefContract = getSousChefContract(sushi)
  const block = useBlock()

  const fetchBalance = useCallback(async () => {
    const balance = await getSousEarned(sousChefContract, account)
    setBalance(new BigNumber(balance))
  }, [account, block, sousChefContract, sushi])

  useEffect(() => {
    if (account && sousChefContract && sushi) {
      fetchBalance()
    }
  }, [account, block, sousChefContract, setBalance, sushi])

  return balance
}

export const useSousLeftBlocks = () => {
  const [text, setText] = useState('')
  const {
    account,
    ethereum,
  }: { account: string; ethereum: provider } = useWallet()
  const sushi = useSushi()
  const sousChefContract = getSousChefContract(sushi)
  const block = useBlock()

  const fetchBalance = useCallback(async () => {
    const start = await getSousStartBlock(sousChefContract)
    const end = await getSousEndBlock(sousChefContract)
    console.log(start, end)
    let buttonText = ''
    if (!block) {
      buttonText= '-'
    }
    else if (block < start) {
      buttonText = `${(start - block).toLocaleString()} blocks until farming starts`
    }
    else if(block > end) {
      buttonText = 'fnished'
    }
    else {
      buttonText = `${(end - block).toLocaleString()} blocks until farming ends`
    }
    setText(buttonText)
  }, [account, block, sousChefContract, sushi])

  useEffect(() => {
    if (account && sousChefContract && sushi) {
      fetchBalance()
    }
  }, [account, block, sousChefContract, setText, sushi])

  return text
}

export default useEarnings
