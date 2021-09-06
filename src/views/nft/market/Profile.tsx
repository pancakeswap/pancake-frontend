import React from 'react'
import { useWeb3React } from '@web3-react/core'
import { useFetchAchievements } from 'state/achievements/hooks'
import { useProfile } from 'state/profile/hooks'
import Page from 'components/Layout/Page'
import Header from './components/BannerHeader'

const NftProfile = () => {
  const { isInitialized, isLoading, hasProfile } = useProfile()
  const { account } = useWeb3React()

  useFetchAchievements()

  return (
    <Page>
      <Header />
    </Page>
  )
}

export default NftProfile
