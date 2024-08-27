import styled from 'styled-components'
import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  Button,
  Card,
  MoreIcon,
  CardBody as RawCardBody,
  CardHeader as RawCardHeader,
  SubMenu,
  ITableViewProps,
  TableView,
  FeeTier,
  Image,
  ISortOrder,
  SORT_ORDER,
  Skeleton,
  useMatchBreakpoints,
} from '@pancakeswap/uikit'
import { TokenPairImage } from 'components/TokenImage'
import { useTranslation } from '@pancakeswap/localization'
import { TokenOverview, toTokenValue } from '@pancakeswap/widgets-internal'
import { UNIVERSAL_FARMS } from '@pancakeswap/farms'
import { useIntersectionObserver } from '@pancakeswap/hooks'
import { useExtendPools, useFarmPools } from 'state/farmsV4/hooks'
import { PoolInfo } from 'state/farmsV4/state/type'
import { PoolSortBy } from 'state/farmsV4/atom'

import { IPoolsFilterPanelProps, MAINNET_CHAINS, PoolsFilterPanel, useSelectedPoolTypes } from './PoolsFilterPanel'

type IDataType = PoolInfo

const PoolsContent = styled.div`
  min-height: calc(100vh - 64px - 56px);
`

const CardHeader = styled(RawCardHeader)`
  background: ${({ theme }) => theme.card.background};
`

const CardBody = styled(RawCardBody)`
  padding: 0;
`

const StyledButton = styled(Button)`
  color: ${({ theme }) => theme.colors.text};
  font-weight: 400;
  padding: 8px 16px;
  line-height: 24px;
  height: auto;
`

const StyledImage = styled(Image)`
  margin-left: auto;
  margin-right: auto;
  margin-top: 58px;
`

const PoolListItemAction = (_: string, _poolInfo: IDataType) => {
  const { t } = useTranslation()
  return (
    <SubMenu
      component={
        <Button scale="xs" variant="text">
          <MoreIcon />
        </Button>
      }
    >
      <StyledButton scale="sm" variant="text" as="a">
        {t('View pool details')}
      </StyledButton>
      <StyledButton scale="sm" variant="text" as="a">
        {t('Add Liquidity')}
      </StyledButton>
      <StyledButton scale="sm" variant="text" as="a">
        {t('View info page')}
      </StyledButton>
    </SubMenu>
  )
}

const useColumnConfig = (): ITableViewProps<IDataType>['columns'] => {
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
            icon={
              <TokenPairImage
                width={40}
                height={40}
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
        render: (value) =>
          value ? (
            <>${Number(value).toLocaleString(undefined, { maximumFractionDigits: 0 })}</>
          ) : (
            <Skeleton width={60} />
          ),
      },
      {
        title: t('Volume 24H'),
        dataIndex: 'vol24hUsd',
        key: 'vol',
        sorter: true,
        minWidth: '145px',
        display: mediaQueries.isXl || mediaQueries.isXxl || mediaQueries.isLg,
        render: (value) =>
          value ? (
            <>${Number(value).toLocaleString(undefined, { maximumFractionDigits: 0 })}</>
          ) : (
            <Skeleton width={60} />
          ),
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

const NUMBER_OF_FARMS_VISIBLE = 20

export const PoolsPage = () => {
  const columns = useColumnConfig()
  const [filters, setFilters] = useState<IPoolsFilterPanelProps['value']>({
    selectedTypeIndex: 0,
    selectedNetwork: MAINNET_CHAINS.map((chain) => chain.id),
    selectedTokens: [],
  })
  const selectedPoolTypes = useSelectedPoolTypes(filters.selectedTypeIndex)
  const { observerRef, isIntersecting } = useIntersectionObserver({
    rootMargin: '100px',
  })
  const [cursorVisible, setCursorVisible] = useState(NUMBER_OF_FARMS_VISIBLE)
  const [sortOrder, setSortOrder] = useState<ISortOrder>(SORT_ORDER.NULL)
  const [sortField, setSortField] = useState<keyof IDataType | null>(null)
  // data source
  const farmPools = useFarmPools()
  const { extendPools, fetchPoolList, resetExtendPools } = useExtendPools()

  const poolList = useMemo(
    () => (!farmPools.loaded ? UNIVERSAL_FARMS : [...farmPools.data, ...extendPools]),
    [farmPools, extendPools],
  )

  useEffect(() => {
    if (isIntersecting) {
      setCursorVisible((numberCurrentlyVisible) => {
        if (numberCurrentlyVisible <= poolList.length) {
          return Math.min(numberCurrentlyVisible + NUMBER_OF_FARMS_VISIBLE, poolList.length)
        }
        return numberCurrentlyVisible
      })
    }
  }, [isIntersecting, poolList])

  useEffect(() => {
    // if consumed, fetch from pool/list
    if (cursorVisible >= poolList.length) {
      // todo:@eric add some loading status to prevent multi fetch
      fetchPoolList({
        chains: filters.selectedNetwork,
        protocols: selectedPoolTypes,
        orderBy: PoolSortBy.VOL,
      })
    }
  }, [cursorVisible, poolList, fetchPoolList, filters, selectedPoolTypes])

  const handleFilterChange: IPoolsFilterPanelProps['onChange'] = useCallback(
    (newFilters) => {
      setFilters((prevFilters) => ({
        ...prevFilters,
        ...newFilters,
      }))
      resetExtendPools()
    },
    [resetExtendPools],
  )

  const filteredData = useMemo(() => {
    const { selectedNetwork, selectedTokens } = filters
    return poolList.filter(
      (farm) =>
        selectedNetwork.includes(farm.chainId) &&
        (!selectedTokens?.length ||
          selectedTokens?.find(
            (token) => token === toTokenValue(farm.token0) || token === toTokenValue(farm.token1),
          )) &&
        selectedPoolTypes.includes(farm.protocol),
    )
  }, [poolList, filters, selectedPoolTypes])

  const sortedData = useMemo(() => {
    if (sortField === null) {
      return filteredData
    }
    return [...filteredData].sort((a, b) => sortOrder * a[sortField] + -1 * sortOrder * b[sortField])
  }, [sortOrder, sortField, filteredData])

  return (
    <Card>
      <CardHeader>
        <PoolsFilterPanel onChange={handleFilterChange} value={filters} />
      </CardHeader>
      <CardBody>
        <PoolsContent>
          <TableView
            rowKey="lpAddress"
            columns={columns}
            data={sortedData.slice(0, cursorVisible) as any}
            onSort={({ order, dataIndex }) => {
              setSortOrder(order)
              setSortField(dataIndex)
            }}
            sortOrder={sortOrder}
            sortField={sortField}
          />
        </PoolsContent>
        {poolList.length > 0 && <div ref={observerRef} />}
        <StyledImage src="/images/decorations/3dpan.png" alt="Pancake illustration" width={120} height={103} />
      </CardBody>
    </Card>
  )
}
