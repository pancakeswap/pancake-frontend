import { useEffect, useState } from 'react'
import BigNumber from 'bignumber.js'
import { useWallet } from 'use-wallet'
import useWeb3 from 'hooks/rework/useWeb3'
import useBlock from '../useBlock'

const ZERO = new BigNumber(0)

const useUserBnbBalance = () => {
  const { account } = useWallet()
  const web3 = useWeb3()
  const [balance, setBalance] = useState(ZERO)
  const block = useBlock()

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = new BigNumber(await web3.eth.getBalance(account))
        setBalance(res)
      } catch (error) {
        console.error(error)
      }
    }
    fetch()
  }, [account, web3, block])

  return balance
}

export default useUserBnbBalance
