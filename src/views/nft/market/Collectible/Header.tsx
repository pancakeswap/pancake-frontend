import React from 'react'
import { Redirect, useParams } from 'react-router'
import { useTranslation } from 'contexts/Localization'
import nfts from 'config/constants/nfts'
import BannerHeader from '../components/BannerHeader'
import MarketPageHeader from '../components/MarketPageHeader'
import AvatarImage from '../components/BannerHeader/AvatarImage'

const Header = () => {
  const { t } = useTranslation()
  const { name } = useParams<{ name: string }>()

  if (!name || !nfts[name]) {
    return <Redirect to="/404" />
  }

  const imgDir = '/images/collections'
  const collectionName = name.toLowerCase()

  return (
    <MarketPageHeader>
      <BannerHeader
        bannerImage={`${imgDir}/${collectionName}.png`}
        bannerAlt={t('collection banner')}
        Avatar={<AvatarImage src={`${imgDir}/${collectionName}-avatar.png`} />}
      />
    </MarketPageHeader>
  )
}

export default Header
