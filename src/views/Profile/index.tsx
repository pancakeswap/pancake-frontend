import React from 'react'
import { Route } from 'react-router-dom'
import { useWeb3React } from '@web3-react/core'
import { Box } from '@pancakeswap-libs/uikit'
import MigrationV2 from 'components/Banner/MigrationV2'
import Container from 'components/layout/Container'
import PageLoader from 'components/PageLoader'
import { useFetchAchievements, useProfile } from 'state/hooks'
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
      <>
        <Box pb={[null, '32px', null, '42px', null, '52px']}>
          <MigrationV2 />
        </Box>
        <Container>
          <ProfileCreation />
        </Container>
      </>
    )
  }

  return (
    <>
      <Box pb={[null, '32px', null, '42px', null, '52px']}>
        <MigrationV2 />
      </Box>
      <Container>
        <Header />
        <Route exact path="/profile">
          <PublicProfile />
        </Route>
        <Route path="/profile/tasks">
          <TaskCenter />
        </Route>
      </Container>
    </>
  )
}

export default Profile
