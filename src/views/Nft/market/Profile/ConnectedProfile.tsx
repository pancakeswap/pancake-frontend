import { Box } from '@pancakeswap/uikit'
import React, { FC } from 'react'
import { useAchievementsForAddress, useProfile } from 'state/profile/hooks'
import { useWeb3React } from '@web3-react/core'
import Page from 'components/Layout/Page'
import styled from 'styled-components'
import MarketPageHeader from '../components/MarketPageHeader'
import ProfileHeader from './components/ProfileHeader'
import TabMenu from './components/TabMenu'
import useNftsForAddress from '../hooks/useNftsForAddress'

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
  const { account } = useWeb3React()
  const { isLoading: isProfileLoading, profile } = useProfile()
  const { achievements, isFetching: isAchievementsFetching } = useAchievementsForAddress(account)
  const { nfts: userNfts, isLoading: isNftLoading } = useNftsForAddress(account, profile, isProfileLoading)

  return (
    <>
      <MarketPageHeader position="relative">
        <ProfileHeader
          accountPath={account}
          profile={profile}
          achievements={achievements}
          nftCollected={userNfts.length}
          isProfileLoading={isProfileLoading}
          isNftLoading={isNftLoading}
          isAchievementsLoading={isAchievementsFetching}
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
