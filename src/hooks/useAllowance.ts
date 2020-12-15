import { useEffect, useState } from 'react'
import BigNumber from 'bignumber.js'
import { useWallet } from 'use-wallet'
import useSushi from './useSushi'
import { getAllowance } from '../utils/erc20'
import { getSushiContract } from '../sushi/utils'
import { getLotteryContract } from '../sushi/lotteryUtils'

const useLotteryAllowance = () => {
  const [allowance, setAllowance] = useState(new BigNumber(0))
  const { account }: { account: string } = useWallet()
  const sushi = useSushi()
  const lotteryContract = getLotteryContract(sushi)
  const cakeContract = getSushiContract(sushi)

  useEffect(() => {
    const fetchAllowance = async () => {
      const res = await getAllowance(cakeContract, lotteryContract, account)
      setAllowance(new BigNumber(res))
    }

    if (account && cakeContract && cakeContract) {
      fetchAllowance()
    }
    const refreshInterval = setInterval(fetchAllowance, 10000)
    return () => clearInterval(refreshInterval)
  }, [account, cakeContract, lotteryContract])

  return allowance
}

export default useLotteryAllowance
