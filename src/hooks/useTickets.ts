import { useCallback, useState, useEffect } from 'react'
import { useWallet } from 'use-wallet'
import BigNumber from 'bignumber.js'

import useSushi from './useSushi'
import useBlock from './useBlock'

import {
  getTotalRewards,
  getTicketsAmount,
  getTotalClaim,
  getMatchingRewardLength,
  getWinningNumbers,
  getTicketsContract,
  getLotteryContract,
  getTickets,
} from '../sushi/lotteryUtils'

const useTickets = () => {
  const [tickets, setTickets] = useState([])
  const { account } = useWallet()
  const sushi = useSushi()
  const ticketsContract = getTicketsContract(sushi)
  const lotteryContract = getLotteryContract(sushi)
  const block = useBlock()

  const fetchBalance = useCallback(async () => {
    const tickets = await getTickets(sushi, lotteryContract, ticketsContract, account)
    setTickets(tickets)
  }, [account, lotteryContract, ticketsContract, block, sushi])

  useEffect(() => {
    if (account && lotteryContract && ticketsContract && sushi) {
      fetchBalance()
    }
  }, [account, block, lotteryContract, setTickets, sushi, fetchBalance, ticketsContract])

  return tickets
}

export const useTicketsAmount = () => {
  const [tickets, setTickets] = useState(0)
  const { account } = useWallet()
  const sushi = useSushi()
  const ticketsContract = getTicketsContract(sushi)
  const block = useBlock()

  const fetchBalance = useCallback(async () => {
    const tickets = await getTicketsAmount(ticketsContract, account)
    setTickets(tickets)
  }, [account, ticketsContract, block])

  useEffect(() => {
    if (account && ticketsContract && sushi) {
      fetchBalance()
    }
  }, [account, block, ticketsContract, setTickets, sushi, fetchBalance])

  return tickets
}

export const useTotalRewards = () => {
  const [rewards, setRewards] = useState(new BigNumber(0))
  const { account } = useWallet()
  const sushi = useSushi()
  const lotteryContract = getLotteryContract(sushi)
  const block = useBlock()

  const fetchBalance = useCallback(async () => {
    const rewards = await getTotalRewards(lotteryContract)
    setRewards(new BigNumber(rewards))
  }, [account, lotteryContract, block])

  useEffect(() => {
    if (account && lotteryContract && sushi) {
      fetchBalance()
    }
  }, [account, block, lotteryContract, setRewards, sushi, fetchBalance])

  return rewards
}

export const useTotalClaim = () => {
  const [claimAmount, setClaimAmount] = useState(new BigNumber(0))
  const [claimLoading, setClaimLoading] = useState(false)
  const { account } = useWallet()
  const sushi = useSushi()
  const ticketsContract = getTicketsContract(sushi)
  const lotteryContract = getLotteryContract(sushi)

  const fetchBalance = useCallback(async () => {
    setClaimLoading(true)
    const claim = await getTotalClaim(sushi, lotteryContract, ticketsContract, account)
    setClaimAmount(claim)
    setClaimLoading(false)
  }, [account, lotteryContract, ticketsContract, sushi])

  useEffect(() => {
    if (account && lotteryContract && ticketsContract && sushi) {
      fetchBalance()
    }
  }, [account, lotteryContract, setClaimAmount, sushi, ticketsContract, fetchBalance])

  return { claimLoading, claimAmount }
}

export const useWinningNumbers = () => {
  const [winngNumbers, setWinningNumbers] = useState([0, 0, 0, 0])
  const { account } = useWallet()
  const sushi = useSushi()
  const lotteryContract = getLotteryContract(sushi)
  const block = useBlock()

  const fetchBalance = useCallback(async () => {
    const rewards = await getWinningNumbers(lotteryContract)
    setWinningNumbers(rewards)
  }, [account, lotteryContract, block])

  useEffect(() => {
    if (account && lotteryContract && sushi) {
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
    const matchedNumbaers = await getMatchingRewardLength(lotteryContract, numbers)
    setMatchingNumbers(matchedNumbaers)
  }, [account, lotteryContract, block])

  useEffect(() => {
    if (account && lotteryContract && sushi) {
      fetchBalance()
    }
  }, [account, block, lotteryContract, setMatchingNumbers, sushi])

  return matchingNumbers
}

export default useTickets
