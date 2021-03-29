import { maxBy } from 'lodash'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { updateRounds } from 'state/predictions'
import { getLatestRounds, makeRoundData } from 'state/predictions/helpers'
import { RoundResponse } from 'state/predictions/queries'

const POLL_TIME_IN_SECONDS = 15

const usePollRounds = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    const timer = setInterval(async () => {
      const latestRounds = (await getLatestRounds()) as RoundResponse[]
      const roundData = makeRoundData(latestRounds)
      dispatch(updateRounds(roundData))
    }, POLL_TIME_IN_SECONDS * 1000)

    return () => {
      clearInterval(timer)
    }
  }, [dispatch])
}

export default usePollRounds
