import React from 'react'
import { useWeb3React } from '@web3-react/core'
import { useParams } from 'react-router'
import { isAddress } from 'utils'
import { Flex, Text } from '@pancakeswap/uikit'
import Page from 'components/Layout/Page'
import { useTranslation } from 'contexts/Localization'
import ConnectedProfile from './ConnectedProfile'
import UnconnectedProfile from './UnconnectedProfile'
import MarketPageHeader from '../components/MarketPageHeader'
import ProfileHeader from './components/ProfileHeader'
import NoNftsImage from './components/NoNftsImage'

const NftProfile = () => {
  const { account } = useWeb3React()
  const { accountAddress } = useParams<{ accountAddress: string }>()
  const { t } = useTranslation()

  const isConnectedProfile = account?.toLowerCase() === accountAddress.toLowerCase()

  const isAddressValid = isAddress(accountAddress) !== false

  if (!isAddressValid) {
    return (
      <>
        <MarketPageHeader position="relative">
          <ProfileHeader accountPath={accountAddress} profile={null} achievements={null} nftCollected={null} />
        </MarketPageHeader>
        <Page style={{ minHeight: 'auto' }}>
          <Flex p="24px" flexDirection="column" alignItems="center">
            <NoNftsImage />
            <Text pt="8px" bold>
              {t('The address entered is not valid')}
            </Text>
          </Flex>
        </Page>
      </>
    )
  }

  return <>{isConnectedProfile ? <ConnectedProfile /> : <UnconnectedProfile />}</>
}

export default NftProfile
