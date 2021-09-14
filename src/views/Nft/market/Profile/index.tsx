import React, { useState, useEffect } from 'react'
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
import UserNfts from './components/UserNfts'
import SubMenu from './components/SubMenu'

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
  const [activeSubMenuIndex, setActiveSubMenuIndex] = useState(0)

  useEffect(() => {
    console.log('Change url')
  }, [activeSubMenuIndex])

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
        <Route path="/nft/market/profile/achievements">
          <SubMenu activeIndex={activeSubMenuIndex} handleClick={setActiveSubMenuIndex} />
          <Achievements points={profile?.points} />
        </Route>
        <Route path="/nft/market/profile/activity">
          <SubMenu activeIndex={activeSubMenuIndex} handleClick={setActiveSubMenuIndex} />
          <span>Activity</span>
        </Route>
        <Route exact path="/nft/market/profile">
          <UserNfts />
        </Route>
      </Page>
    </>
  )
}

export default NftProfile
