import React from 'react'
import Page from 'components/layout/Page'
import Header from './Header'
import ProfileCreationProvider from './contexts/ProfileCreationProvider'
import Steps from './Steps'

const ProfileCreation = () => (
  <ProfileCreationProvider>
    <Page>
      <Header />
      <Steps />
    </Page>
  </ProfileCreationProvider>
)

export default ProfileCreation
