import { useTranslation } from '@pancakeswap/localization'
import { BasicDataType, FeeTier, ITableViewProps, Skeleton, useMatchBreakpoints } from '@pancakeswap/uikit'
import { FiatNumberDisplay, TokenOverview } from '@pancakeswap/widgets-internal'
import { TokenPairImage } from 'components/TokenImage'
import { useMemo } from 'react'
import { PoolListItemAction } from './PoolListItemAction'

export const useColumnConfig = <T extends BasicDataType>(): ITableViewProps<T>['columns'] => {
  const { t } = useTranslation()
  const mediaQueries = useMatchBreakpoints()
  return useMemo(
    () => [
      {
        title: t('All Pools'),
        dataIndex: null,
        key: 'name',
        minWidth: '200px',
        render: (_, item) => (
          <TokenOverview
            isReady
            token={item.token0}
            quoteToken={item.token1}
            width="48px"
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
        render: (fee, item) => <FeeTier type={item.protocol} fee={fee ?? 0} denominator={item.feeTierBase} />,
      },
      {
        title: t('APR'),
        dataIndex: 'lpApr',
        key: 'apr',
        sorter: true,
        render: (value) =>
          value ? (
            <>{(Number(value) * 100).toLocaleString(undefined, { maximumFractionDigits: 2 })}%</>
          ) : (
            <Skeleton width={60} />
          ),
      },
      {
        title: t('TVL'),
        dataIndex: 'tvlUsd',
        key: 'tvl',
        sorter: true,
        display: mediaQueries.isXl || mediaQueries.isXxl,
        render: (value) => (value ? <FiatNumberDisplay value={value} /> : <Skeleton width={60} />),
      },
      {
        title: t('Volume 24H'),
        dataIndex: 'vol24hUsd',
        key: 'vol',
        sorter: true,
        minWidth: '145px',
        display: mediaQueries.isXl || mediaQueries.isXxl || mediaQueries.isLg,
        render: (value) => (value ? <FiatNumberDisplay value={value} /> : <Skeleton width={60} />),
      },
      {
        title: '',
        render: PoolListItemAction,
        dataIndex: null,
        key: 'action',
      },
    ],
    [t, mediaQueries],
  )
}

export const useColumnMobileConfig = <T extends BasicDataType>(): ITableViewProps<T>['columns'] => {
  const { t } = useTranslation()
  const mediaQueries = useMatchBreakpoints()
  return useMemo(
    () => [
      {
        title: t('APR'),
        dataIndex: 'lpApr',
        key: 'apr',
        sorter: true,
        render: (value) =>
          value ? (
            <>{(Number(value) * 100).toLocaleString(undefined, { maximumFractionDigits: 2 })}%</>
          ) : (
            <Skeleton width={60} />
          ),
      },
      {
        title: t('Fee Tier'),
        dataIndex: 'feeTier',
        key: 'feeTier',
        display: mediaQueries.isXl || mediaQueries.isXxl,
        render: (fee, item) => <FeeTier type={item.protocol} fee={fee ?? 0} denominator={item.feeTierBase} />,
      },
      {
        title: t('TVL'),
        dataIndex: 'tvlUsd',
        key: 'tvl',
        sorter: true,
        display: mediaQueries.isXl || mediaQueries.isXxl,
        render: (value) => (value ? <FiatNumberDisplay value={value} /> : <Skeleton width={60} />),
      },
      {
        title: t('Volume 24H'),
        dataIndex: 'vol24hUsd',
        key: 'vol',
        sorter: true,
        minWidth: '145px',
        display: mediaQueries.isXl || mediaQueries.isXxl || mediaQueries.isLg,
        render: (value) => (value ? <FiatNumberDisplay value={value} /> : <Skeleton width={60} />),
      },
    ],
    [t, mediaQueries],
  )
}
