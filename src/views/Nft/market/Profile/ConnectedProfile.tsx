import { Box } from '@pancakeswap/uikit'
import { useWeb3React } from '@web3-react/core'
import Page from 'components/Layout/Page'
import { FetchStatus } from 'config/constants/types'
import React, { FC } from 'react'
import { useAchievements, useFetchAchievements } from 'state/achievements/hooks'
import { useUserNfts } from 'state/nftMarket/hooks'
import { UserNftInitializationState } from 'state/nftMarket/types'
import { useProfile } from 'state/profile/hooks'
import styled from 'styled-components'
import MarketPageHeader from '../components/MarketPageHeader'
import ProfileHeader from './components/ProfileHeader'
import TabMenu from './components/TabMenu'
import useFetchUserNfts from './hooks/useFetchUserNfts'

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

const ConnectedProfile: FC = ({ children }) => {
  const { profile, isLoading: isProfileLoading } = useProfile()
  const { achievements, achievementFetchStatus } = useAchievements()
  const { account } = useWeb3React()
  const { userNftsInitializationState, nfts: userNfts } = useUserNfts()

  useFetchAchievements()
  useFetchUserNfts()

  return (
    <>
      <MarketPageHeader position="relative">
        <ProfileHeader
          accountPath={account}
          profile={profile}
          achievements={achievements}
          nftCollected={userNfts.length}
          isProfileLoading={isProfileLoading}
          isNftLoading={userNftsInitializationState !== UserNftInitializationState.INITIALIZED}
          isAchievementsLoading={achievementFetchStatus !== FetchStatus.Fetched}
        />
        <TabMenuWrapper>
          <TabMenu />
        </TabMenuWrapper>
      </MarketPageHeader>
      <Page style={{ minHeight: 'auto' }}>{children}</Page>
    </>
  )
}

export default ConnectedProfile
