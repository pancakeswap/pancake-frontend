import { useEffect, useState } from 'react'
import { useWallet } from 'use-wallet'
import useSushi from 'hooks/useSushi'
import { getLotteryContract, getLotteryStatus } from 'sushi/lotteryUtils'

/**
 * Returns whether or not the current lottery has drawn numbers
 *
 * @return {Boolean}
 */
const useGetLotteryHasDrawn = () => {
  const [lotteryHasDrawn, setLotteryHasDrawn] = useState(true)
  const { account } = useWallet()
  const sushi = useSushi()
  const lotteryContract = getLotteryContract(sushi)

  useEffect(() => {
    if (account && lotteryContract && sushi) {
      const fetchLotteryStatus = async () => {
        const state = await getLotteryStatus(lotteryContract)
        setLotteryHasDrawn(state)
      }

      fetchLotteryStatus()
    }
  }, [lotteryContract, sushi, account, setLotteryHasDrawn])

  return lotteryHasDrawn
}

export default useGetLotteryHasDrawn
