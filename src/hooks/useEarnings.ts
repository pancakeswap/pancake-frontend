import { useEffect, useState } from 'react'
import BigNumber from 'bignumber.js'
import { useWallet } from 'use-wallet'
import { getEarned, getSousEarned, getSousChefContract, getMasterChefContract } from 'sushi/utils'
import { usePoolFromPid } from 'state/hooks'
import useSushi from './useSushi'
import useBlock from './useBlock'

export const useSousEarnings = (sousId) => {
  const block = useBlock()
  const [balance, setBalance] = useState(new BigNumber(0))
  const { account }: { account: string } = useWallet()
  const sushi = useSushi()
  const sousChefContract = getSousChefContract(sushi, sousId)
  const masterChefContract = getMasterChefContract(sushi)

  useEffect(() => {
    const fetchBalance = async () => {
      if (sousId === 0) {
        const res = await getEarned(masterChefContract, '0', account)
        setBalance(new BigNumber(res))
      } else {
        const res = await getSousEarned(sousChefContract, account)
        setBalance(new BigNumber(res))
      }
    }

    if (account && sousChefContract) {
      fetchBalance()
    }
  }, [account, masterChefContract, sousChefContract, sousId, block])

  return balance
}

export const useSousLeftBlocks = (sousId) => {
  const { startBlock, endBlock, isFinished } = usePoolFromPid(sousId)
  const block = useBlock()

  return {
    blocksUntilStart: Math.max(startBlock - block, 0),
    blocksRemaining: Math.max(endBlock - block, 0),
    isFinished: sousId === 0 ? false : isFinished || block > endBlock,
  }
}
