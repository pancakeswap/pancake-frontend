import React, { useEffect } from 'react'
import { useWeb3React } from '@web3-react/core'
import { useAppDispatch } from 'state'
import { useGetLeaderboardLoadingState } from 'state/predictions/hooks'
import { initializeLeaderboard } from 'state/predictions'
import { LeaderboardLoadingState } from 'state/types'
import PageLoader from 'components/Loader/PageLoader'
import Hero from './components/Hero'
import Results from './components/Results'

const Leaderboard = () => {
  const leaderboardLoadingState = useGetLeaderboardLoadingState()
  const { account } = useWeb3React()
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(initializeLeaderboard(account))
  }, [account, dispatch])

  if (leaderboardLoadingState === LeaderboardLoadingState.INITIAL) {
    return <PageLoader />
  }

  return (
    <>
      <Hero />
      <Results />
    </>
  )
}

export default Leaderboard
