import { useCallback, useState, useEffect } from 'react'
import { useWallet } from 'use-wallet'
import BigNumber from 'bignumber.js'
import useSushi from './useSushi'
import useBlock from './useBlock'
import {
  getTotalRewards,
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

  useEffect(() => {
    const fetchBalance = async () => {
      const tickets = await getTickets(sushi, lotteryContract, ticketsContract, account)
      setTickets(tickets)
    }

    if (account && lotteryContract && ticketsContract && sushi) {
      fetchBalance()
    }
  }, [account, block, lotteryContract, setTickets, sushi, ticketsContract])

  return tickets
}

export const useTotalRewards = () => {
  const [rewards, setRewards] = useState(new BigNumber(0))
  const { account } = useWallet()
  const sushi = useSushi()
  const lotteryContract = getLotteryContract(sushi)
  const block = useBlock()

  useEffect(() => {
    const fetchBalance = async () => {
      const rewards = await getTotalRewards(lotteryContract)
      setRewards(new BigNumber(rewards))
    }

    if (account && lotteryContract && sushi) {
      fetchBalance()
    }
  }, [account, block, lotteryContract, setRewards, sushi])

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

  useEffect(() => {
    const fetchBalance = async () => {
      const rewards = await getWinningNumbers(lotteryContract)
      setWinningNumbers(rewards)
    }

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

  useEffect(() => {
    const fetchBalance = async () => {
      const matchedNumbaers = await getMatchingRewardLength(lotteryContract, numbers)
      setMatchingNumbers(matchedNumbaers)
    }

    if (account && lotteryContract && sushi) {
      fetchBalance()
    }
  }, [account, block, lotteryContract, numbers, setMatchingNumbers, sushi])

  return matchingNumbers
}

export default useTickets
