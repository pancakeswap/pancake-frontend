import { useEffect, useState } from 'react'
import { useWeb3React } from '@web3-react/core'
import BigNumber from 'bignumber.js'
import { getWeb3NoAccount } from 'utils/web3'
import useRefresh from './useRefresh'

const useGetBnbBalance = () => {
  const [balance, setBalance] = useState(new BigNumber(0))
  const { account } = useWeb3React()
  const { slowRefresh } = useRefresh()

  useEffect(() => {
    const fetchBalance = async () => {
      const web3 = getWeb3NoAccount()
      const walletBalance = await web3.eth.getBalance(account)
      setBalance(new BigNumber(walletBalance))
    }

    if (account) {
      fetchBalance()
    }
  }, [account, slowRefresh, setBalance])

  return balance
}

export default useGetBnbBalance
