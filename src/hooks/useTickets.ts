import { useCallback, useState, useEffect } from 'react'
import { useWallet } from 'use-wallet'
import BigNumber from 'bignumber.js'

import useSushi from './useSushi'
import useBlock from './useBlock'

import { buy, getTotalRewards, getTotalClaim, getMatchingRewardLength, getWinningNumbers, getTicketsContract, getLotteryContract, getTickets } from '../sushi/lotteryUtils'

const useTickets = () => {
  const [tickets, setTickets] = useState([])
  const { account } = useWallet()
  const sushi = useSushi()
  const ticketsContract = getTicketsContract(sushi)
  const lotteryContract = getLotteryContract(sushi)
  const block = useBlock()

  const fetchBalance = useCallback(async () => {
    const tickets = await getTickets(lotteryContract, ticketsContract, account)
    setTickets(tickets)
  }, [account, lotteryContract, ticketsContract, block])

  useEffect(() => {
    if (account && lotteryContract && ticketsContract &&  sushi) {
      fetchBalance()
    }
  }, [account, block, lotteryContract, setTickets, sushi])

  return tickets
}

export const useTotalRewards = () => {
  const [rewards, setRewards] = useState(new BigNumber(0))
  const { account } = useWallet()
  const sushi = useSushi()
  const lotteryContract = getLotteryContract(sushi)
  const block = useBlock()

  const fetchBalance = useCallback(async () => {
    const rewards = await getTotalRewards(lotteryContract, account)
    setRewards(new BigNumber(rewards))
  }, [account, lotteryContract, block])

  useEffect(() => {
    if (account && lotteryContract &&  sushi) {
      fetchBalance()
    }
  }, [account, block, lotteryContract, setRewards, sushi])

  return rewards
}

export const useTotalClaim = () => {
  const [claimAmount, setClaimAmount] = useState(new BigNumber(0))
  const { account } = useWallet()
  const sushi = useSushi()
  const ticketsContract = getTicketsContract(sushi)
  const lotteryContract = getLotteryContract(sushi)
  const block = useBlock()

  const fetchBalance = useCallback(async () => {
    const claim = await getTotalClaim(lotteryContract, ticketsContract, account)
    setClaimAmount(claim)
  }, [account, lotteryContract, ticketsContract, block])

  useEffect(() => {
    if (account && lotteryContract && ticketsContract &&  sushi) {
      fetchBalance()
    }
  }, [account, block, lotteryContract, setClaimAmount, sushi])

  return claimAmount
}

export const useWinningNumbers = () => {
  const [winngNumbers, setWinningNumbers] = useState([0,0,0,0])
  const { account } = useWallet()
  const sushi = useSushi()
  const lotteryContract = getLotteryContract(sushi)
  const block = useBlock()

  const fetchBalance = useCallback(async () => {
    const rewards = await getWinningNumbers(lotteryContract, account)
    setWinningNumbers(rewards)
  }, [account, lotteryContract, block])

  useEffect(() => {
    if (account && lotteryContract &&  sushi) {
      fetchBalance()
    }
  }, [account, block, lotteryContract, setWinningNumbers, sushi])

  return winngNumbers
}

export const useMatchingRewardLength = (numbers) => {
  const [matchingNumbers, setMatchingNumbers] = useState(0)
  const { account } = useWallet()
  const sushi = useSushi()
  const lotteryContract = getLotteryContract(sushi)
  const block = useBlock()

  const fetchBalance = useCallback(async () => {
    const matchedNumbaers = await getMatchingRewardLength(lotteryContract, numbers, account)
    setMatchingNumbers(matchedNumbaers)
  }, [account, lotteryContract, block])

  useEffect(() => {
    if (account && lotteryContract &&  sushi) {
      fetchBalance()
    }
  }, [account, block, lotteryContract, setMatchingNumbers, sushi])

  return matchingNumbers
}


export default useTickets
