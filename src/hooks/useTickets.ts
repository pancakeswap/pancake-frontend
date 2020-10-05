import { useCallback, useState, useEffect } from 'react'
import { useWallet } from 'use-wallet'
import BigNumber from 'bignumber.js'

import useSushi from './useSushi'
import useBlock from './useBlock'

import { buy, getTotalRewards, getTicketsContract, getLotteryContract, getTickets } from '../sushi/lotteryUtils'

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


export default useTickets
