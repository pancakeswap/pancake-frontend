import React, { FC } from 'react'
import { useRouter } from 'next/router'
import { isAddress } from 'utils'
import { useAchievementsForAddress, useProfileForAddress } from 'state/profile/hooks'
import { Box, Flex, Text } from '@pancakeswap/uikit'
import Page from 'components/Layout/Page'
import { useTranslation } from 'contexts/Localization'
import styled from 'styled-components'
import MarketPageHeader from '../components/MarketPageHeader'
import ProfileHeader from './components/ProfileHeader'
import NoNftsImage from '../components/Activity/NoNftsImage'
import useNftsForAddress from '../hooks/useNftsForAddress'
import TabMenu from './components/TabMenu'

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

const NftProfile: FC = ({ children }) => {
  const accountAddress = useRouter().query.accountAddress as string
  const { t } = useTranslation()

  const invalidAddress = !accountAddress || isAddress(accountAddress) === false

  const {
    profile: profileHookState,
    isFetching: isProfileFetching,
    refresh: refreshProfile,
  } = useProfileForAddress(accountAddress)
  const { profile } = profileHookState || {}
  const { achievements, isFetching: isAchievementsFetching } = useAchievementsForAddress(accountAddress)
  const {
    nfts: userNfts,
    isLoading: isNftLoading,
    refresh: refreshUserNfts,
  } = useNftsForAddress(accountAddress, profile, isProfileFetching)

  if (invalidAddress) {
    return (
      <>
        <MarketPageHeader position="relative">
          <ProfileHeader
            accountPath={accountAddress}
            profile={null}
            achievements={null}
            nftCollected={null}
            isAchievementsLoading={false}
            isNftLoading={false}
            isProfileLoading={false}
          />
        </MarketPageHeader>
        <Page style={{ minHeight: 'auto' }}>
          <Flex p="24px" flexDirection="column" alignItems="center">
            <NoNftsImage />
            <Text textAlign="center" maxWidth="420px" pt="8px" bold>
              {t('Please enter a valid address, or connect your wallet to view your profile')}
            </Text>
          </Flex>
        </Page>
      </>
    )
  }

  return (
    <>
      <MarketPageHeader position="relative">
        <ProfileHeader
          accountPath={accountAddress}
          profile={profile}
          achievements={achievements}
          nftCollected={userNfts.length}
          isProfileLoading={isProfileFetching}
          isNftLoading={isNftLoading}
          isAchievementsLoading={isAchievementsFetching}
          onSuccess={async () => {
            await refreshProfile()
            refreshUserNfts()
          }}
        />
        <TabMenuWrapper>
          <TabMenu />
        </TabMenuWrapper>
      </MarketPageHeader>
      <Page style={{ minHeight: 'auto' }}>{children}</Page>
    </>
  )
}

export const NftProfileLayout: FC = ({ children }) => {
  return <NftProfile>{children}</NftProfile>
}

export default NftProfile
