import { useTranslation } from '@pancakeswap/localization'
import {
  CalculateIcon,
  DonateIcon,
  HooksIcon,
  PoolTypeIcon,
  SingletonIcon,
  useMatchBreakpoints,
} from '@pancakeswap/uikit'
import { ASSET_CDN } from 'config/constants/endpoints'
import { useMemo } from 'react'

export const useFeaturesConfig = () => {
  const { t } = useTranslation()
  const { isMd } = useMatchBreakpoints()

  const iconSize = useMemo(() => (isMd ? 20 : 24), [isMd])

  return useMemo(
    () => [
      {
        id: 0,
        title: t('Hooks'),
        icon: <HooksIcon color="secondary" width={iconSize} height={iconSize} />,
        subTitle: t(
          "Unlock unparalleled customization with Hooks, enhancing liquidity pool functionality through smart contracts.Tailor your liquidity pools precisely, defining Hook contracts for key actions like initialize, swap, modify,position, and donate. Enable dynamic fees, on-chain limit orders, custom oracles, and more with PancakeSwap's Hooks!",
        ),
        imgUrl: `${ASSET_CDN}/web/v4-landing/feature-1.png`,
      },
      {
        id: 1,
        title: t('Customized Pool Types'),
        icon: <PoolTypeIcon color="secondary" width={iconSize} height={iconSize} />,
        subTitle: t(
          "Explore a modular and sustainable design for AMMs, supporting multiple pool types and AMM logic through Hooks and gas optimization. Launching with CLAMM pools featuring Hooks and the first-ever liquidity book AMM, PancakeSwap v4's architecture ensures future-proof deployment of sophisticated AMM logic.",
        ),
        imgUrl: `${ASSET_CDN}/web/v4-landing/feature-2.png`,
      },
      {
        id: 2,
        title: t('Singleton'),
        icon: <SingletonIcon color="secondary" width={iconSize} height={iconSize} />,
        subTitle: t(
          'Introducing Singleton for unparalleled trading efficiency and gas savings. Singleton consolidates all pools, cutting gas costs by 99% for deploying new pools. Multi-hop transactions are streamlined, eliminating the need for token movement between contracts.',
        ),
        imgUrl: `${ASSET_CDN}/web/v4-landing/feature-3.png`,
      },
      {
        id: 3,
        title: t('Flash Accounting'),
        icon: <CalculateIcon color="secondary" width={iconSize} height={iconSize} />,
        subTitle: t(
          'Flash Accounting optimizes gas usage by computing net balances for transactions and settling them collectively,resulting in significant gas savings.',
        ),
        imgUrl: `${ASSET_CDN}/web/v4-landing/feature-4.png`,
      },
      {
        id: 4,
        title: t('Donate'),
        icon: <DonateIcon color="secondary" width={iconSize} height={iconSize} />,
        subTitle: t(
          "Empower your liquidity pool with the innovative Donate method. It enables direct payments to in-range LPs in one or both pool tokens. Donate ensures seamless and efficient transactions by leveraging the pool's fee accounting system.",
        ),
        imgUrl: `${ASSET_CDN}/web/v4-landing/feature-5.png`,
      },
    ],
    [t, iconSize],
  )
}
