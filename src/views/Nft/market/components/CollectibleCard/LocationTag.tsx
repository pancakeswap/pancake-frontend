import React from 'react'
import { NftLocation } from 'state/nftMarket/types'
import { Text, Flex, WalletFilledIcon, CameraIcon, SellIcon } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'

const LocationTag: React.FC<{ nftLocation: NftLocation }> = ({ nftLocation }) => {
  const { t } = useTranslation()

  const WalletTag = () => {
    return (
      <Flex justifyContent="center">
        <WalletFilledIcon height="12px" color="secondary" />
        <Text color="secondary" fontSize="14px">
          {t('Wallet')}
        </Text>
      </Flex>
    )
  }

  const ForSaleTag = () => {
    return (
      <Flex justifyContent="center">
        <SellIcon height="12px" color="failure" />
        <Text color="failure" fontSize="14px">
          {t('For sale')}
        </Text>
      </Flex>
    )
  }

  const ProfilePicTag = () => {
    return (
      <Flex justifyContent="center">
        <CameraIcon height="12px" color="textSubtle" />
        <Text color="textSubtle" fontSize="14px">
          {t('Profile')}
        </Text>
      </Flex>
    )
  }

  const tagsConfig = {
    [NftLocation.WALLET]: WalletTag(),
    [NftLocation.PROFILE]: ProfilePicTag(),
    [NftLocation.FORSALE]: ForSaleTag(),
  }

  return tagsConfig[nftLocation]
}

export default LocationTag
