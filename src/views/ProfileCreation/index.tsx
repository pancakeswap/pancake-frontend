import React from 'react'
import { useWeb3React } from '@web3-react/core'
import { Redirect } from 'react-router'
import Page from 'components/Layout/Page'
import { useProfile } from 'state/profile/hooks'
import PageLoader from 'components/Loader/PageLoader'
import Header from './Header'
import ProfileCreationProvider from './contexts/ProfileCreationProvider'
import Steps from './Steps'

const ProfileCreation = () => {
  const { account } = useWeb3React()
  const { isInitialized, isLoading, hasProfile } = useProfile()

  if (!isInitialized || isLoading) {
    return <PageLoader />
  }

  if (account && hasProfile) {
    return <Redirect to="/nft/market/profile" />
  }

  return (
    <>
      <ProfileCreationProvider>
        <Page>
          <Header />
          <Steps />
        </Page>
      </ProfileCreationProvider>
    </>
  )
}

export default ProfileCreation
