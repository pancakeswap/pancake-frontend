import React from 'react'
import styled from 'styled-components'
import { useProfile } from 'state/profile/hooks'
import { useWeb3React } from '@web3-react/core'
import { useAchievements, useFetchAchievements } from 'state/achievements/hooks'
import { Box } from '@pancakeswap/uikit'
import Page from 'components/Layout/Page'
import { Route } from 'react-router'
import { useUserNfts } from 'state/nftMarket/hooks'
import useFetchUserNfts from './hooks/useFetchUserNfts'
import MarketPageHeader from '../components/MarketPageHeader'
import ProfileHeader from './components/ProfileHeader'
import TabMenu from './components/TabMenu'
import Achievements from './components/Achievements'
import Activity from './components/Activity'
import SubMenu from './components/SubMenu'
import UserNfts from './components/UserNfts'

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
  const { nfts: userNfts } = useUserNfts()

  useFetchAchievements()
  useFetchUserNfts(account)

  return (
    <>
      <MarketPageHeader position="relative">
        <ProfileHeader account={account} profile={profile} achievements={achievements} nftCollected={userNfts.length} />
        <TabMenuWrapper>
          <TabMenu />
        </TabMenuWrapper>
      </MarketPageHeader>
      <Page style={{ minHeight: 'auto' }}>
        <Route path="/nfts/profile/achievements">
          <Achievements points={profile?.points} />
        </Route>
        <Route path="/nfts/profile/activity">
          <SubMenu />
          <Activity />
        </Route>
        <Route exact path="/nfts/profile">
          <SubMenu />
          <UserNfts />
        </Route>
      </Page>
    </>
  )
}

export default NftProfile
