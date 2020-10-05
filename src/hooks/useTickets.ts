import { useCallback, useState, useEffect } from 'react'
import { useWallet } from 'use-wallet'
import { provider } from 'web3-core'

import useSushi from './useSushi'
import useBlock from './useBlock'

import { buy, getTicketsContract, getLotteryContract, getTickets } from '../sushi/lotteryUtils'

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

export default useTickets
