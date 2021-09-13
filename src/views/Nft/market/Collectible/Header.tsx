import React from 'react'
import { Text } from '@pancakeswap/uikit'
import { Collection } from 'state/nftMarket/types'
import { useTranslation } from 'contexts/Localization'
import { formatNumber } from 'utils/formatBalance'
import MarketPageHeader from '../components/MarketPageHeader'
import MarketPageTitle from '../components/MarketPageTitle'
import StatBox, { StatBoxItem } from '../components/StatBox'
import BannerHeader from '../components/BannerHeader'
import AvatarImage from '../components/BannerHeader/AvatarImage'

interface HeaderProps {
  collection: Collection
}

const Header: React.FC<HeaderProps> = ({ collection }) => {
  const { t } = useTranslation()

  // Temp
  const items = 10000
  const owners = 1202
  const lowest = 0.33
  const vol = 11929.329

  return (
    <MarketPageHeader>
      <BannerHeader
        bannerImage={`/images/collections/${collection.slug}.png`}
        avatar={<AvatarImage src={`/images/collections/${collection.slug}-avatar.png`} />}
      />
      <MarketPageTitle
        title={collection.name}
        description={collection.description ? <Text color="textSubtle">{t(collection.description)}</Text> : null}
      >
        <StatBox>
          <StatBoxItem title={t('Items')} stat={formatNumber(items, 0, 0)} />
          <StatBoxItem title={t('Owners')} stat={formatNumber(owners, 0, 0)} />
          <StatBoxItem title={t('Lowest (%symbol%)', { symbol: 'BNB' })} stat={formatNumber(lowest, 0, 4)} />
          <StatBoxItem title={t('Vol. (%symbol%)', { symbol: 'BNB' })} stat={formatNumber(vol, 0, 4)} />
        </StatBox>
      </MarketPageTitle>
    </MarketPageHeader>
  )
}

export default Header
