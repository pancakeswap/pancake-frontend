import { useTranslation } from '@pancakeswap/localization'
import { Percent } from '@pancakeswap/swap-sdk-core'
import { BasicDataType, IColumnsType, ITableViewProps, Skeleton, useMatchBreakpoints } from '@pancakeswap/uikit'
import { FeatureStack, FeeTierTooltip, FiatNumberDisplay, TokenOverview } from '@pancakeswap/widgets-internal'
import { TokenPairImage } from 'components/TokenImage'
import { useMemo } from 'react'
import type { PoolInfo } from 'state/farmsV4/state/type'
import { getChainFullName } from '../utils'
import { PoolGlobalAprButton } from './PoolAprButton'
import { PoolListItemAction } from './PoolListItemAction'

const FeeTierComponent = <T extends BasicDataType>({ fee, item }: { fee: number; item: T }) => {
  const percent = useMemo(() => new Percent(fee ?? 0, item.feeTierBase || 1), [fee, item.feeTierBase])
  return <FeeTierTooltip type={item.protocol} percent={percent} />
}

const useAPRConfig = () => {
  const { t } = useTranslation()
  return useMemo(
    () =>
      ({
        title: t('APR'),
        dataIndex: 'lpApr',
        key: 'apr',
        render: (value, info) => (value ? <PoolGlobalAprButton pool={info} /> : <Skeleton width={60} />),
      } as IColumnsType<PoolInfo>),
    [t],
  )
}

const useFeeConfig = () => {
  const { t } = useTranslation()
  return useMemo(
    () =>
      ({
        title: t('Fee Tier'),
        dataIndex: 'feeTier',
        key: 'feeTier',
        render: (fee, item) => <FeeTierComponent fee={fee} item={item} />,
      } as IColumnsType<PoolInfo>),
    [t],
  )
}

const useVol24Config = () => {
  const { t } = useTranslation()
  return useMemo(
    () =>
      ({
        title: t('Volume 24H'),
        dataIndex: 'vol24hUsd',
        key: 'vol',
        render: (value) =>
          value ? <FiatNumberDisplay value={value} showFullDigitsTooltip={false} /> : <Skeleton width={60} />,
      } as IColumnsType<PoolInfo>),
    [t],
  )
}

const useTVLConfig = () => {
  const { t } = useTranslation()
  return useMemo(
    () =>
      ({
        title: t('TVL'),
        dataIndex: 'tvlUsd',
        key: 'tvl',
        render: (value) =>
          value ? <FiatNumberDisplay value={value} showFullDigitsTooltip={false} /> : <Skeleton width={60} />,
      } as IColumnsType<PoolInfo>),
    [t],
  )
}

export const useColumnConfig = (): ITableViewProps<PoolInfo>['columns'] => {
  const { t } = useTranslation()
  const mediaQueries = useMatchBreakpoints()
  const vol24hUsdConf = useVol24Config()
  const TVLUsdConf = useTVLConfig()
  const feeTierConf = useFeeConfig()
  const APRConf = useAPRConfig()

  return useMemo(
    () => [
      {
        title: t('All Pools'),
        dataIndex: null,
        key: 'name',
        minWidth: '210px',
        render: (_, item) => (
          <TokenOverview
            isReady
            token={item.token0}
            quoteToken={item.token1}
            width="48px"
            getChainName={getChainFullName}
            icon={
              <TokenPairImage
                width={44}
                height={44}
                variant="inverted"
                primaryToken={item.token0}
                secondaryToken={item.token1}
              />
            }
          />
        ),
      },
      {
        ...feeTierConf,
        display: mediaQueries.isXl || mediaQueries.isXxl,
      },
      {
        ...APRConf,
        sorter: true,
        minWidth: '260px',
      },
      {
        ...TVLUsdConf,
        sorter: true,
        minWidth: '145px',
        display: mediaQueries.isXl || mediaQueries.isXxl,
      },
      {
        ...vol24hUsdConf,
        sorter: true,
        minWidth: '145px',
        display: mediaQueries.isXl || mediaQueries.isXxl || mediaQueries.isLg,
      },
      {
        title: t('pool type'),
        dataIndex: 'protocol',
        key: 'protocol',
        minWidth: '110px',
        display: mediaQueries.isXxl,
        render: (value) => <FeatureStack features={[value]} />,
      },

      {
        title: '',
        render: (value) => <PoolListItemAction pool={value} />,
        dataIndex: null,
        key: 'action',
        clickable: false,
      },
    ],
    [t, mediaQueries, APRConf, feeTierConf, vol24hUsdConf, TVLUsdConf],
  )
}

export const useColumnMobileConfig = (): ITableViewProps<PoolInfo>['columns'] => {
  const vol24hUsdConf = useVol24Config()
  const TVLUsdConf = useTVLConfig()
  const feeTierConf = useFeeConfig()
  const APRConf = useAPRConfig()
  return useMemo(
    () => [APRConf, feeTierConf, TVLUsdConf, vol24hUsdConf],
    [APRConf, feeTierConf, vol24hUsdConf, TVLUsdConf],
  )
}
