import React from 'react'
import Page from 'components/layout/Page'
import ProfileCreation from './ProfileCreation'

const hasProfile = false

const Profile = () => {
  if (!hasProfile) {
    return (
      <Page>
        <ProfileCreation />
      </Page>
    )
  }

  return <Page>Profile</Page>
}

export default Profile
