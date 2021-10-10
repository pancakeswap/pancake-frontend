import { useWeb3React } from '@web3-react/core'
import { useEffect } from 'react'
import { useAppDispatch } from 'state'
import { updateMarketData } from 'state/predictions'
import { getMarketData } from 'state/predictions/helpers'

const POLL_TIME_IN_SECONDS = 10

const usePollRoundData = () => {
  const dispatch = useAppDispatch()
  const { account } = useWeb3React()

  useEffect(() => {
    const timer = setInterval(async () => {
      const marketData = await getMarketData()

      dispatch(updateMarketData(marketData))
    }, POLL_TIME_IN_SECONDS * 1000)

    return () => {
      clearInterval(timer)
    }
  }, [account, dispatch])
}

export default usePollRoundData
