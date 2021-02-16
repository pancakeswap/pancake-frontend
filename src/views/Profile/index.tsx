import React from 'react'
import { Route } from 'react-router-dom'
import { useWallet } from '@binance-chain/bsc-use-wallet'
import Page from 'components/layout/Page'
import PageLoader from 'components/PageLoader'
import { useFetchAchievements, useProfile } from 'state/hooks'
import ProfileCreation from './ProfileCreation'
import Header from './components/Header'
import TaskCenter from './TaskCenter'
import PublicProfile from './PublicProfile'

const Profile = () => {
  const { isInitialized, isLoading, hasProfile } = useProfile()
  const { account } = useWallet()

  useFetchAchievements()

  if (!isInitialized || isLoading) {
    return <PageLoader />
  }

  if (account && !hasProfile) {
    return (
      <Page>
        <ProfileCreation />
      </Page>
    )
  }

  return (
    <Page>
      <Header />
      <Route exact path="/profile">
        <PublicProfile />
      </Route>
      <Route path="/profile/tasks">
        <TaskCenter />
      </Route>
    </Page>
  )
}

export default Profile
