import React from 'react'
import { Collection } from 'config/constants/nfts/types'
import { useTranslation } from 'contexts/Localization'
import { formatNumber } from 'utils/formatBalance'
import MarketPageHeader from '../components/MarketPageHeader'
import MarketPageTitle from '../components/MarketPageTitle'
import StatBox, { StatBoxItem } from '../components/StatBox'

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
      <MarketPageTitle title={collection.name} description={collection.description ? t(collection.description) : null}>
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
