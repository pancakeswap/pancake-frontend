import { useState, useEffect } from 'react'
import { bnToDec } from 'utils'
import { getWeb3 } from 'utils/web3'
import BigNumber from 'bignumber.js'
import { useWallet } from '@binance-chain/bsc-use-wallet'

export const useBnbBalance = () => {
  const { account } = useWallet()
  const [balance, setBalance] = useState('0')
  useEffect(() => {
    const web3 = getWeb3()
    web3.eth
      .getBalance(account)
      .then((rs) => {
        setBalance(`${bnToDec(new BigNumber(rs))}`)
      })
      .catch()
  }, [account])

  return balance
}

export default {}
