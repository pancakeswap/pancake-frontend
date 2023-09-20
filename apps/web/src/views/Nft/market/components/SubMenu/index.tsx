import React, { useMemo } from 'react'
import { useRouter } from 'next/router'
import { SubMenuItems } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import { nftsBaseUrl } from 'views/Nft/market/constants'

const SubMenu: React.FC<React.PropsWithChildren> = () => {
  const { query, pathname } = useRouter()
  const { t } = useTranslation()

  const subMenuItems = useMemo(() => {
    return [
      { label: t('Overview'), href: `${nftsBaseUrl}` },
      { label: t('Collections'), href: `${nftsBaseUrl}/collections` },
      { label: t('Activity'), href: `${nftsBaseUrl}/activity` },
    ]
  }, [t])

  const activeSubItem = useMemo(() => {
    // /nfts/collections/${collectionAddress} & /nfts/collections/${collectionAddress}/${tokenId}
    if (query.collectionAddress) {
      return `${nftsBaseUrl}/collections`
    }

    return subMenuItems.find((subMenuItem) => subMenuItem.href === pathname)?.href
  }, [subMenuItems, query, pathname])

  return <SubMenuItems items={subMenuItems} activeItem={activeSubItem} />
}

export default SubMenu
