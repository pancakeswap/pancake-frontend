import React from 'react'
import { Route } from 'react-router-dom'
import Page from 'components/layout/Page'
import PageLoader from 'components/PageLoader'
import { useProfile } from 'state/hooks'
import ProfileCreation from './ProfileCreation'
import Header from './components/Header'
import TaskCenter from './TaskCenter'
import PublicProfile from './PublicProfile'

const Profile = () => {
  const { isInitialized, hasProfile } = useProfile()

  if (!isInitialized) {
    return <PageLoader />
  }

  if (!hasProfile) {
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
        <TaskCenter />
      </Route>
      <Route path="/profile/view">
        <PublicProfile />
      </Route>
    </Page>
  )
}

export default Profile
