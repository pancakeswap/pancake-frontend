import { useTranslation } from '@pancakeswap/localization'
import { SUPPORTED_CHAIN_IDS as POOL_SUPPORTED_CHAINS } from '@pancakeswap/pools'
import { SUPPORTED_CHAIN_IDS as POSITION_MANAGERS_SUPPORTED_CHAINS } from '@pancakeswap/position-managers'
import { SubMenuItems } from '@pancakeswap/uikit'
import { addMenuItemSupported } from 'components/Menu/config/config'
import { SUPPORT_CAKE_STAKING, SUPPORT_FARMS } from 'config/constants/supportChains'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { useRouter } from 'next/router'
import React, { useMemo } from 'react'

export const SubMenu: React.FC<React.PropsWithChildren> = () => {
  const { pathname } = useRouter()
  const { t } = useTranslation()
  const { chainId } = useActiveChainId()

  const subMenuItems = useMemo(() => {
    return [
      {
        label: t('Farm / Liquidity'),
        href: '/liquidity/pools',
        supportChainIds: SUPPORT_FARMS,
      },
      {
        label: t('Position Manager'),
        href: '/position-managers',
        supportChainIds: POSITION_MANAGERS_SUPPORTED_CHAINS,
      },
      {
        label: t('CAKE Staking'),
        href: '/cake-staking',
        supportChainIds: SUPPORT_CAKE_STAKING,
      },
      {
        label: t('Syrup Pools'),
        href: '/pools',
        supportChainIds: POOL_SUPPORTED_CHAINS,
      },
    ].map((item) => addMenuItemSupported(item, chainId))
  }, [chainId, t])

  const activeSubItem = useMemo(() => {
    if (pathname === '/liquidity/positions') {
      return subMenuItems[0].href // liquidity
    }

    return subMenuItems.find((subMenuItem) => pathname.includes(subMenuItem.href))?.href
  }, [subMenuItems, pathname])

  return <SubMenuItems items={subMenuItems} activeItem={activeSubItem} />
}
