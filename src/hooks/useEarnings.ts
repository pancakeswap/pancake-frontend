import { useEffect, useState } from 'react'
import { provider } from 'web3-core'
import BigNumber from 'bignumber.js'
import { useWallet } from 'use-wallet'
import {
  getEarned,
  getSousEarned,
  getSousChefContract,
  getMasterChefContract,
  getSousEndBlock,
  getSousStartBlock,
} from '../sushi/utils'
import useSushi from './useSushi'
import useBlock from './useBlock'

const useEarnings = (pid: number) => {
  const [balance, setBalance] = useState(new BigNumber(0))
  const { account }: { account: string; ethereum: provider } = useWallet()
  const sushi = useSushi()
  const masterChefContract = getMasterChefContract(sushi)
  const block = useBlock()

  useEffect(() => {
    const fetchBalance = async () => {
      const balance = await getEarned(masterChefContract, pid, account)
      setBalance(new BigNumber(balance))
    }

    if (account && masterChefContract && sushi) {
      fetchBalance()
    }
  }, [account, block, masterChefContract, pid, setBalance, sushi])

  return balance
}

export const useSousEarnings = (sousId) => {
  const [balance, setBalance] = useState(new BigNumber(0))
  const { account }: { account: string; ethereum: provider } = useWallet()
  const sushi = useSushi()
  const sousChefContract = getSousChefContract(sushi, sousId)
  const masterChefContract = getMasterChefContract(sushi)
  const block = useBlock()

  useEffect(() => {
    const fetchBalance = async () => {
      if (sousId === 0) {
        const balance = await getEarned(masterChefContract, '0', account)
        setBalance(new BigNumber(balance))
      } else {
        const balance = await getSousEarned(sousChefContract, account)
        setBalance(new BigNumber(balance))
      }
    }

    if (account && sousChefContract && sushi) {
      fetchBalance()
    }
  }, [account, block, sousChefContract, setBalance, sushi, sousId, masterChefContract])

  return balance
}

export const useSousLeftBlocks = (sousId) => {
  const [state, setState] = useState({
    text: '', // TODO: deprecate this in favor of lettings consumer format the message
    farmStart: 0,
    blocksRemaining: 0,
    isFinished: false,
  })
  const { account }: { account: string; ethereum: provider } = useWallet()
  const sushi = useSushi()
  const sousChefContract = getSousChefContract(sushi, sousId)
  const block = useBlock()

  useEffect(() => {
    const fetchBalance = async () => {
      const start = await getSousStartBlock(sousChefContract)
      const end = await getSousEndBlock(sousChefContract)
      const blocksRemaining = end - block

      let buttonText = ''
      if (!block) {
        buttonText = '-'
      } else if (block < start) {
        buttonText = `Farming starts in ${(start - block).toLocaleString()} Blocks`
      } else if (block > end) {
        buttonText = 'finished'
      } else {
        buttonText = `Farming ends in ${blocksRemaining.toLocaleString()} Blocks`
      }
      setState({
        text: buttonText,
        farmStart: block < start ? start - block : 0,
        blocksRemaining: blocksRemaining > 0 ? blocksRemaining : 0,
        isFinished: sousId === 0 ? false : block > end,
      })
    }

    if (account && sousChefContract && sushi) {
      fetchBalance()
    }
  }, [account, block, sousChefContract, setState, sushi, sousId])

  return state
}

export default useEarnings
