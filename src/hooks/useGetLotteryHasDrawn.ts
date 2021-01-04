import { useEffect, useState } from 'react'
import { useWallet } from '@binance-chain/bsc-use-wallet'
import { getLotteryContract, getLotteryStatus } from 'sushi/lotteryUtils'

/**
 * Returns whether or not the current lottery has drawn numbers
 *
 * @return {Boolean}
 */
const useGetLotteryHasDrawn = () => {
  const [lotteryHasDrawn, setLotteryHasDrawn] = useState(true)
  const { account } = useWallet()
  const lotteryContract = getLotteryContract()

  useEffect(() => {
    if (account && lotteryContract) {
      const fetchLotteryStatus = async () => {
        const state = await getLotteryStatus(lotteryContract)
        setLotteryHasDrawn(state)
      }

      fetchLotteryStatus()
    }
  }, [account, lotteryContract])

  return lotteryHasDrawn
}

export default useGetLotteryHasDrawn
