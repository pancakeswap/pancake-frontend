import { useTranslation } from '@pancakeswap/localization'
import { Percent } from '@pancakeswap/swap-sdk-core'
import { BasicDataType, ITableViewProps, Skeleton, useMatchBreakpoints } from '@pancakeswap/uikit'
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

export const useColumnConfig = (): ITableViewProps<PoolInfo>['columns'] => {
  const { t } = useTranslation()
  const mediaQueries = useMatchBreakpoints()
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
        title: t('Fee Tier'),
        dataIndex: 'feeTier',
        key: 'feeTier',
        display: mediaQueries.isXl || mediaQueries.isXxl,
        render: (fee, item) => <FeeTierComponent fee={fee} item={item} />,
      },
      {
        title: t('APR'),
        dataIndex: 'lpApr',
        key: 'apr',
        sorter: true,
        minWidth: '260px',
        render: (value, info) => (value ? <PoolGlobalAprButton pool={info} /> : <Skeleton width={60} />),
      },
      {
        title: t('TVL'),
        dataIndex: 'tvlUsd',
        key: 'tvl',
        sorter: true,
        minWidth: '145px',
        display: mediaQueries.isXl || mediaQueries.isXxl,
        render: (value) =>
          value ? <FiatNumberDisplay value={value} showFullDigitsTooltip={false} /> : <Skeleton width={60} />,
      },
      {
        title: t('Volume 24H'),
        dataIndex: 'vol24hUsd',
        key: 'vol',
        sorter: true,
        minWidth: '145px',
        display: mediaQueries.isXl || mediaQueries.isXxl || mediaQueries.isLg,
        render: (value) =>
          value ? <FiatNumberDisplay value={value} showFullDigitsTooltip={false} /> : <Skeleton width={60} />,
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
    [t, mediaQueries],
  )
}

export const useColumnMobileConfig = (): ITableViewProps<PoolInfo>['columns'] => {
  const { t } = useTranslation()
  const mediaQueries = useMatchBreakpoints()
  return useMemo(
    () => [
      {
        title: t('APR'),
        dataIndex: 'lpApr',
        key: 'apr',
        render: (value, info) => (value ? <PoolGlobalAprButton pool={info} /> : <Skeleton width={60} />),
      },
      {
        title: t('Fee Tier'),
        dataIndex: 'feeTier',
        key: 'feeTier',
        display: mediaQueries.isXl || mediaQueries.isXxl,
        render: (fee, item) => <FeeTierComponent fee={fee} item={item} />,
      },
      {
        title: t('TVL'),
        dataIndex: 'tvlUsd',
        key: 'tvl',
        display: mediaQueries.isXl || mediaQueries.isXxl,
        render: (value, item) =>
          value ? (
            <FiatNumberDisplay
              value={value}
              tooltipText={
                item.isFarming
                  ? t('Total active (in-range) liquidity staked in the farm.')
                  : t('Total Value Locked (TVL) in the pool.')
              }
            />
          ) : (
            <Skeleton width={60} />
          ),
      },
      {
        title: t('Volume 24H'),
        dataIndex: 'vol24hUsd',
        key: 'vol',
        display: mediaQueries.isXl || mediaQueries.isXxl || mediaQueries.isLg,
        render: (value) =>
          value ? <FiatNumberDisplay value={value} showFullDigitsTooltip={false} /> : <Skeleton width={60} />,
      },
    ],
    [t, mediaQueries],
  )
}
