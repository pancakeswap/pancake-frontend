import React from 'react'
import styled from 'styled-components'
import { useProfile } from 'state/profile/hooks'
import { useWeb3React } from '@web3-react/core'
import { useAchievements, useFetchAchievements } from 'state/achievements/hooks'
import { Box } from '@pancakeswap/uikit'
import Page from 'components/Layout/Page'
import { Route } from 'react-router'
import MarketPageHeader from '../components/MarketPageHeader'
import ProfileHeader from './components/ProfileHeader'
import TabMenu from './components/TabMenu'
import Achievements from './components/Achievements'

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

const NftProfile = () => {
  const { profile } = useProfile()
  const achievements = useAchievements()
  const { account } = useWeb3React()

  useFetchAchievements()

  return (
    <>
      <MarketPageHeader position="relative">
        <ProfileHeader account={account} profile={profile} achievements={achievements} />
        <TabMenuWrapper>
          <TabMenu />
        </TabMenuWrapper>
      </MarketPageHeader>

      <Page style={{ minHeight: 'auto' }}>
        <Route exact path="/nft/market/profile">
          <span>Profile</span>
        </Route>
        <Route exact path="/nft/market/profile/activity">
          <span>Activity</span>
        </Route>
        <Route path="/nft/market/profile/achievements">
          <Achievements points={profile?.points} />
        </Route>
      </Page>
    </>
  )
}

export default NftProfile
