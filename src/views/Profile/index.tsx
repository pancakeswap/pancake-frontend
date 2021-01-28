import React from 'react'
import { Route } from 'react-router-dom'
import Page from 'components/layout/Page'
import ProfileCreation from './ProfileCreation'
import Header from './components/Header'
import TaskCenter from './TaskCenter'
import PublicProfile from './PublicProfile'

const hasProfile = true

const Profile = () => {
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
