import React from 'react'
import { Route } from 'react-router-dom'
import { useWeb3React } from '@web3-react/core'
import Page from 'components/Layout/Page'
import PageLoader from 'components/Loader/PageLoader'
import { useProfile } from 'state/profile/hooks'
import { useFetchAchievements } from 'state/achievements/hooks'
import ProfileCreation from './ProfileCreation'
import Header from './components/Header'
import TaskCenter from './TaskCenter'
import PublicProfile from './PublicProfile'

const Profile = () => {
  const { isInitialized, isLoading, hasProfile } = useProfile()
  const { account } = useWeb3React()

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
