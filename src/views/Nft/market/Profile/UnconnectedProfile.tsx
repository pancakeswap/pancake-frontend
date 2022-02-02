import { Box } from '@pancakeswap/uikit'
import Page from 'components/Layout/Page'
import { useRouter } from 'next/router'
import React, { FC } from 'react'
import { useAchievementsForAddress, useProfileForAddress } from 'state/profile/hooks'
import styled from 'styled-components'
import MarketPageHeader from '../components/MarketPageHeader'
import ProfileHeader from './components/ProfileHeader'
import TabMenu from './components/TabMenu'
import useNftsForAddress from './hooks/useNftsForAddress'

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

const UnconnectedProfile: FC = ({ children }) => {
  const accountAddress = useRouter().query.accountAddress as string
  const { profile: profileHookState, isFetching: isProfileFetching } = useProfileForAddress(accountAddress)
  const { profile } = profileHookState || {}
  const { achievements, isFetching: isAchievementFetching } = useAchievementsForAddress(accountAddress)
  const { nfts, isLoading: isNftLoading } = useNftsForAddress(accountAddress, profile, isProfileFetching)

  return (
    <>
      <MarketPageHeader position="relative">
        <ProfileHeader
          accountPath={accountAddress}
          profile={profile}
          achievements={achievements}
          nftCollected={nfts.length}
          isProfileLoading={isProfileFetching}
          isNftLoading={isNftLoading}
          isAchievementsLoading={isAchievementFetching}
        />
        <TabMenuWrapper>
          <TabMenu />
        </TabMenuWrapper>
      </MarketPageHeader>
      <Page style={{ minHeight: 'auto' }}>{children}</Page>
    </>
  )
}

export default UnconnectedProfile
