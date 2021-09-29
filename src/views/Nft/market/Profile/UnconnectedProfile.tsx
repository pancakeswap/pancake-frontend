import React from 'react'
import styled from 'styled-components'
import { useAchievementsForAddress, useProfileForAddress } from 'state/profile/hooks'
import { Box } from '@pancakeswap/uikit'
import Page from 'components/Layout/Page'
import { Route, useParams } from 'react-router'
import { nftsBaseUrl } from 'views/Nft/market/constants'
import MarketPageHeader from '../components/MarketPageHeader'
import ProfileHeader from './components/ProfileHeader'
import TabMenu from './components/TabMenu'
import Achievements from './components/Achievements'
import ActivityHistory from './components/ActivityHistory'
import SubMenu from './components/SubMenu'
import useGetNftsForAddress from './hooks/useGetNftsForAddress'
import UnconnectedProfileNfts from './components/UnconnectedProfileNfts'

const TabMenuWrapper = styled(Box)`
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translate(-50%, 0%);

  ${({ theme }) => theme.mediaQueries.sm} {
    left: auto;
    transform: none;
  }
`

const UnconnectedProfile = () => {
  const { accountAddress } = useParams<{ accountAddress: string }>()
  const { profile: profileHookState, isFetching: isProfileFetching } = useProfileForAddress(accountAddress)
  const { profile } = profileHookState || {}
  const { achievements } = useAchievementsForAddress(accountAddress)
  const { nfts, isLoading } = useGetNftsForAddress(accountAddress, profile, isProfileFetching)

  return (
    <>
      <MarketPageHeader position="relative">
        <ProfileHeader
          accountPath={accountAddress}
          profile={profile}
          achievements={achievements}
          nftCollected={nfts.length}
        />
        <TabMenuWrapper>
          <TabMenu />
        </TabMenuWrapper>
      </MarketPageHeader>
      <Page style={{ minHeight: 'auto' }}>
        <Route path={`${nftsBaseUrl}/profile/:accountAddress/achievements`}>
          <Achievements achievements={achievements} points={profile?.points} />
        </Route>
        <Route path={`${nftsBaseUrl}/profile/:accountAddress/activity`}>
          <SubMenu />
          <ActivityHistory />
        </Route>
        <Route exact path={`${nftsBaseUrl}/profile/:accountAddress`}>
          <SubMenu />
          <UnconnectedProfileNfts nfts={nfts} isLoading={isLoading} />
        </Route>
      </Page>
    </>
  )
}

export default UnconnectedProfile
