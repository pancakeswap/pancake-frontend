import { useEffect, useState } from 'react'
import { useWeb3React } from '@web3-react/core'
import { useLottery } from 'hooks/useContract'
import { getLotteryStatus } from 'utils/lotteryUtils'

/**
 * Returns whether or not the current lottery has drawn numbers
 *
 * @return {Boolean}
 */
const useGetLotteryHasDrawn = () => {
  const [lotteryHasDrawn, setLotteryHasDrawn] = useState(true)
  const lotteryContract = useLottery()

  useEffect(() => {
    if (lotteryContract) {
      const fetchLotteryStatus = async () => {
        const state = await getLotteryStatus(lotteryContract)
        setLotteryHasDrawn(state)
      }

      fetchLotteryStatus()
    }
  }, [lotteryContract])

  return lotteryHasDrawn
}

export default useGetLotteryHasDrawn
