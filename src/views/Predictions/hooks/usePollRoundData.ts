import { useWeb3React } from '@web3-react/core'
import { useEffect } from 'react'
import { useAppDispatch } from 'state'
import { updateRounds } from 'state/predictions'
import { getLatestRounds, makeRoundData } from 'state/predictions/helpers'
import { RoundResponse } from 'state/predictions/queries'

const POLL_TIME_IN_SECONDS = 15

const usePollRoundData = () => {
  const dispatch = useAppDispatch()
  const { account } = useWeb3React()

  useEffect(() => {
    const timer = setInterval(async () => {
      const latestRounds = (await getLatestRounds()) as RoundResponse[]
      const roundData = makeRoundData(latestRounds)
      dispatch(updateRounds(roundData))
    }, POLL_TIME_IN_SECONDS * 1000)

    return () => {
      clearInterval(timer)
    }
  }, [account, dispatch])
}

export default usePollRoundData
