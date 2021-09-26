import React from 'react'
import { useLocation, useParams } from 'react-router'
import { Text } from '@pancakeswap/uikit'
import { Collection } from 'state/nftMarket/types'
import { useTranslation } from 'contexts/Localization'
import Container from 'components/Layout/Container'
import MarketPageHeader from '../components/MarketPageHeader'
import MarketPageTitle from '../components/MarketPageTitle'
import StatBox, { StatBoxItem } from '../components/StatBox'
import BannerHeader from '../components/BannerHeader'
import AvatarImage from '../components/BannerHeader/AvatarImage'
import BaseSubMenu from '../components/BaseSubMenu'
import { nftsBaseUrl } from '../constants'
import TopBar from './TopBar'
import LowestPriceStatBoxItem from './LowestPriceStatBoxItem'

interface HeaderProps {
  collection: Collection
}

const Header: React.FC<HeaderProps> = ({ collection }) => {
  const { collectionAddress } = useParams<{ collectionAddress: string }>()
  const { totalSupply, numberTokensListed, totalVolumeBNB, banner, avatar } = collection
  const { t } = useTranslation()
  const { pathname } = useLocation()

  const volume = parseFloat(totalVolumeBNB).toLocaleString(undefined, {
    minimumFractionDigits: 3,
    maximumFractionDigits: 3,
  })

  const itemsConfig = [
    {
      label: t('Items'),
      href: `${nftsBaseUrl}/collections/${collectionAddress}`,
    },
    {
      label: t('Traits'),
      href: `${nftsBaseUrl}/collections/${collectionAddress}/traits`,
    },
  ]

  return (
    <>
      <MarketPageHeader>
        <TopBar />
        <BannerHeader bannerImage={banner.large} avatar={<AvatarImage src={avatar} />} />
        <MarketPageTitle
          title={collection.name}
          description={collection.description ? <Text color="textSubtle">{t(collection.description)}</Text> : null}
        >
          <StatBox>
            <StatBoxItem title={t('Items')} stat={totalSupply} />
            <StatBoxItem title={t('Owners')} stat={numberTokensListed} />
            <LowestPriceStatBoxItem collectionAddress={collection.address} />
            <StatBoxItem title={t('Vol. (%symbol%)', { symbol: 'BNB' })} stat={volume} />
          </StatBox>
        </MarketPageTitle>
      </MarketPageHeader>
      <Container>
        <BaseSubMenu items={itemsConfig} activeItem={pathname} mt="24px" mb="8px" />
      </Container>
    </>
  )
}

export default Header
