import React from 'react'
import { ethers } from 'ethers'
import { Text } from '@pancakeswap/uikit'
import { Collection } from 'state/nftMarket/types'
import { useTranslation } from 'contexts/Localization'
import { formatBigNumber, formatNumber } from 'utils/formatBalance'
import slugify from 'utils/slugify'
import MarketPageHeader from '../components/MarketPageHeader'
import MarketPageTitle from '../components/MarketPageTitle'
import StatBox, { StatBoxItem } from '../components/StatBox'
import BannerHeader from '../components/BannerHeader'
import AvatarImage from '../components/BannerHeader/AvatarImage'

interface HeaderProps {
  collection: Collection
}

const Header: React.FC<HeaderProps> = ({ collection }) => {
  const { totalSupply, numberTokensListed, totalVolumeBNB } = collection
  const { t } = useTranslation()
  const owners = ethers.BigNumber.from(numberTokensListed)
  const volume = ethers.BigNumber.from(totalVolumeBNB)

  // This might be temporary
  const slug = slugify(collection.name)

  return (
    <MarketPageHeader>
      <BannerHeader
        bannerImage={`/images/collections/${slug}-banner-lg.png`}
        avatar={<AvatarImage src={`/images/collections/${slug}-avatar.png`} />}
      />
      <MarketPageTitle
        title={collection.name}
        description={collection.description ? <Text color="textSubtle">{t(collection.description)}</Text> : null}
      >
        <StatBox>
          <StatBoxItem title={t('Items')} stat={formatNumber(totalSupply, 0, 0)} />
          <StatBoxItem title={t('Owners')} stat={formatBigNumber(owners, 0, 0)} />
          <StatBoxItem title={t('Vol. (%symbol%)', { symbol: 'BNB' })} stat={formatBigNumber(volume, 0, 0)} />
        </StatBox>
      </MarketPageTitle>
    </MarketPageHeader>
  )
}

export default Header
