import React from 'react'
import Container from 'components/layout/Container'
import Header from './Header'
import ProfileCreationProvider from './contexts/ProfileCreationProvider'
import Steps from './Steps'

const ProfileCreation = () => (
  <ProfileCreationProvider>
    <Container>
      <Header />
      <Steps />
    </Container>
  </ProfileCreationProvider>
)

export default ProfileCreation
