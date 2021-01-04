import { useCallback, useState, useEffect } from 'react'
import { useWallet } from '@binance-chain/bsc-use-wallet'
import BigNumber from 'bignumber.js'
import useRefresh from './useRefresh'
import {
  getTotalRewards,
  getTotalClaim,
  getMatchingRewardLength,
  getWinningNumbers,
  getTicketsContract,
  getLotteryContract,
  getTickets,
} from '../sushi/lotteryUtils'

const useTickets = (lotteryNumber = null) => {
  const [tickets, setTickets] = useState([])
  const { account } = useWallet()
  const ticketsContract = getTicketsContract()
  const lotteryContract = getLotteryContract()
  const { fastRefresh } = useRefresh()

  useEffect(() => {
    const fetchBalance = async () => {
      const res = await getTickets(lotteryContract, ticketsContract, account, lotteryNumber)
      setTickets(res)
    }

    if (account && lotteryContract && ticketsContract) {
      fetchBalance()
    }
  }, [account, lotteryContract, ticketsContract, fastRefresh, lotteryNumber])

  return tickets
}

export const useTotalRewards = () => {
  const [rewards, setRewards] = useState(new BigNumber(0))
  const { account } = useWallet()
  const lotteryContract = getLotteryContract()
  const { fastRefresh } = useRefresh()

  useEffect(() => {
    const fetchBalance = async () => {
      const res = await getTotalRewards(lotteryContract)
      setRewards(new BigNumber(res))
    }

    if (account && lotteryContract) {
      fetchBalance()
    }
  }, [account, lotteryContract, fastRefresh])

  return rewards
}

export const useTotalClaim = () => {
  const [claimAmount, setClaimAmount] = useState(new BigNumber(0))
  const [claimLoading, setClaimLoading] = useState(false)
  const { account } = useWallet()
  const ticketsContract = getTicketsContract()
  const lotteryContract = getLotteryContract()

  const fetchBalance = useCallback(async () => {
    setClaimLoading(true)
    const claim = await getTotalClaim(lotteryContract, ticketsContract, account)
    setClaimAmount(claim)
    setClaimLoading(false)
  }, [account, lotteryContract, ticketsContract])

  useEffect(() => {
    if (account && lotteryContract && ticketsContract) {
      fetchBalance()
    }
  }, [account, fetchBalance, lotteryContract, ticketsContract])

  return { claimLoading, claimAmount }
}

export const useWinningNumbers = () => {
  const [winngNumbers, setWinningNumbers] = useState([0, 0, 0, 0])
  const { account } = useWallet()
  const lotteryContract = getLotteryContract()
  const { fastRefresh } = useRefresh()

  useEffect(() => {
    const fetchBalance = async () => {
      const rewards = await getWinningNumbers(lotteryContract)
      setWinningNumbers(rewards)
    }

    if (account && lotteryContract) {
      fetchBalance()
    }
  }, [account, fastRefresh, lotteryContract, setWinningNumbers])

  return winngNumbers
}

export const useMatchingRewardLength = (numbers) => {
  const [matchingNumbers, setMatchingNumbers] = useState(0)
  const { account } = useWallet()
  const lotteryContract = getLotteryContract()
  const { fastRefresh } = useRefresh()

  useEffect(() => {
    const fetchBalance = async () => {
      const matchedNumbaers = await getMatchingRewardLength(lotteryContract, numbers)
      setMatchingNumbers(matchedNumbaers)
    }

    if (account && lotteryContract) {
      fetchBalance()
    }
  }, [account, lotteryContract, numbers, fastRefresh])

  return matchingNumbers
}

export default useTickets
