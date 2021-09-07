import React from 'react'
import { Redirect, useParams } from 'react-router'
import { useTranslation } from 'contexts/Localization'
import nfts from 'config/constants/nfts'
import { formatNumber } from 'utils/formatBalance'
import MarketPageHeader from '../components/MarketPageHeader'
import MarketPageTitle from '../components/MarketPageTitle'
import StatBox, { StatBoxItem } from '../components/StatBox'

const Header = () => {
  const { t } = useTranslation()
  const { name } = useParams<{ name: string }>()

  if (!name || !nfts[name]) {
    return <Redirect to="/404" />
  }

  // const imgDir = '/images/collections'
  // const collectionName = name.toLowerCase()

  // Temp
  const items = 10000
  const owners = 1202
  const lowest = 0.33
  const vol = 11929.329

  return (
    <MarketPageHeader>
      <MarketPageTitle
        title={name}
        description={t("PancakeSwap's first official generative NFT collection.. Join the squad.")}
      >
        <StatBox>
          <StatBoxItem title={t('Items')} stat={formatNumber(items, 0, 0)} />
          <StatBoxItem title={t('Owners')} stat={formatNumber(owners, 0, 0)} />
          <StatBoxItem title={t('Lowest (BNB)')} stat={formatNumber(lowest, 0, 4)} />
          <StatBoxItem title={t('Vol. (BNB)')} stat={formatNumber(vol, 0, 4)} />
        </StatBox>
      </MarketPageTitle>
    </MarketPageHeader>
  )
}

export default Header
