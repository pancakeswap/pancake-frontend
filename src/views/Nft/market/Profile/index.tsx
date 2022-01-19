import React, { FC } from 'react'
import { useWeb3React } from '@web3-react/core'
import { useRouter } from 'next/router'
import { isAddress } from 'utils'
import { Flex, Text } from '@pancakeswap/uikit'
import Page from 'components/Layout/Page'
import { useTranslation } from 'contexts/Localization'
import ConnectedProfile from './ConnectedProfile'
import UnconnectedProfile from './UnconnectedProfile'
import MarketPageHeader from '../components/MarketPageHeader'
import ProfileHeader from './components/ProfileHeader'
import NoNftsImage from '../components/Activity/NoNftsImage'
import { NftMarketLayout } from '../Layout'

const NftProfile: FC = ({ children }) => {
  const { account } = useWeb3React()
  const accountAddress = useRouter().query.accountAddress as string
  const { t } = useTranslation()

  const isConnectedProfile = account?.toLowerCase() === accountAddress?.toLowerCase()
  const invalidAddress = !accountAddress || isAddress(accountAddress) === false

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
      {isConnectedProfile ? (
        <ConnectedProfile>{children}</ConnectedProfile>
      ) : (
        <UnconnectedProfile>{children}</UnconnectedProfile>
      )}
    </>
  )
}

export const NftProfileLayout: FC = ({ children }) => {
  return (
    <NftProfile>
      <NftMarketLayout>{children}</NftMarketLayout>
    </NftProfile>
  )
}

export default NftProfile
