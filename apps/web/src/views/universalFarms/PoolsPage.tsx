import styled from 'styled-components'
import { useRouter } from 'next/router'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from '@pancakeswap/localization'
import { toTokenValueByCurrency } from '@pancakeswap/widgets-internal'
import { UNIVERSAL_FARMS } from '@pancakeswap/farms'
import { useIntersectionObserver, useTheme } from '@pancakeswap/hooks'
import { Button, InfoIcon, ISortOrder, SORT_ORDER, TableView, useMatchBreakpoints } from '@pancakeswap/uikit'
import { useAllTokensByChainIds } from 'hooks/Tokens'
import { PoolSortBy } from 'state/farmsV4/atom'
import { useExtendPools, useFarmPools, usePoolsApr } from 'state/farmsV4/hooks'
import { getCombinedApr } from 'state/farmsV4/state/poolApr/utils'
import type { PoolInfo } from 'state/farmsV4/state/type'

import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  IPoolsFilterPanelProps,
  ListView,
  MAINNET_CHAINS,
  PoolsFilterPanel,
  getPoolDetailPageLink,
  useColumnConfig,
  useSelectedPoolTypes,
} from './components'

type IDataType = PoolInfo

const PoolsContent = styled.div`
  min-height: calc(100vh - 64px - 56px);
`

const NUMBER_OF_FARMS_VISIBLE = 20

export const PoolsPage = () => {
  const nextRouter = useRouter()
  const { t } = useTranslation()
  const { theme } = useTheme()
  const { isMobile } = useMatchBreakpoints()

  const columns = useColumnConfig()
  const allChainIds = useMemo(() => MAINNET_CHAINS.map((chain) => chain.id), [])
  const [filters, setFilters] = useState<IPoolsFilterPanelProps['value']>({
    selectedTypeIndex: 0,
    selectedNetwork: allChainIds,
    selectedTokens: [],
  })
  const selectedPoolTypes = useSelectedPoolTypes(filters.selectedTypeIndex)
  const { observerRef, isIntersecting } = useIntersectionObserver({
    rootMargin: '100px',
  })
  const [cursorVisible, setCursorVisible] = useState(NUMBER_OF_FARMS_VISIBLE)
  const [sortOrder, setSortOrder] = useState<ISortOrder>(SORT_ORDER.NULL)
  const [sortField, setSortField] = useState<keyof IDataType | null>(null)
  const [isPoolListExtended, setIsPoolListExtended] = useState(false)

  // data source
  const { loaded: fetchFarmListLoaded, data: farmList } = useFarmPools()
  const { extendPools, fetchPoolList, resetExtendPools } = useExtendPools()
  const allTokenMap = useAllTokensByChainIds(allChainIds)
  const poolsApr = usePoolsApr()
  // we disabled extend pools in phase 1, we can turn it off later when we need
  const disabledExtendPools = true
  const EMPTY_POOLS = useMemo(() => [], [])

  const extendPoolList = useMemo(
    () =>
      disabledExtendPools
        ? EMPTY_POOLS
        : isPoolListExtended
        ? extendPools
        : extendPools.filter(
            (pool) =>
              // non farming list need to do a whitelist filter
              pool.token0.wrapped.address in allTokenMap[pool.chainId] &&
              pool.token1.wrapped.address in allTokenMap[pool.chainId],
          ),
    [disabledExtendPools, isPoolListExtended, extendPools, allTokenMap, EMPTY_POOLS],
  )

  const farmListWithExtendPools = useMemo(() => farmList.concat(extendPoolList), [farmList, extendPoolList])

  const poolList = useMemo(
    () => (fetchFarmListLoaded && farmList.length ? farmListWithExtendPools : UNIVERSAL_FARMS),
    [fetchFarmListLoaded, farmListWithExtendPools, farmList],
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
    if (cursorVisible >= poolList.length && !disabledExtendPools) {
      fetchPoolList({
        chains: filters.selectedNetwork,
        protocols: selectedPoolTypes,
        orderBy: PoolSortBy.VOL,
      })
    }
  }, [cursorVisible, poolList, fetchPoolList, filters, selectedPoolTypes, disabledExtendPools])

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

  const handleToggleListExpand = useCallback(() => {
    setIsPoolListExtended(!isPoolListExtended)
  }, [isPoolListExtended])

  const handleSort = useCallback(({ order, dataIndex }) => {
    setSortField(dataIndex)
    // we don't need asc sort, so reset it to null
    if (order === SORT_ORDER.ASC) {
      setSortOrder(SORT_ORDER.NULL)
    } else {
      setSortOrder(order)
    }
  }, [])

  const handleRowClick = useCallback(
    (pool: PoolInfo) => {
      nextRouter.push(getPoolDetailPageLink(pool))
    },
    [nextRouter],
  )

  const getRowKey = useCallback((item: PoolInfo) => {
    return [item.chainId, item.protocol, item.pid].join(':')
  }, [])

  const filteredData = useMemo(() => {
    return poolList.filter(
      (farm) =>
        filters.selectedNetwork.includes(farm.chainId) &&
        (!filters.selectedTokens?.length ||
          filters.selectedTokens?.find(
            (token) => token === toTokenValueByCurrency(farm.token0) || token === toTokenValueByCurrency(farm.token1),
          )) &&
        selectedPoolTypes.includes(farm.protocol),
    )
  }, [poolList, filters.selectedTokens, filters.selectedNetwork, selectedPoolTypes])

  const sortedData = useMemo(() => {
    if (sortField === null) {
      return filteredData
    }
    return [...filteredData].sort((a, b) => {
      if (sortField === 'lpApr') {
        const aprOfA = getCombinedApr(poolsApr, a.chainId, a.lpAddress)
        const aprOfB = getCombinedApr(poolsApr, b.chainId, b.lpAddress)
        return sortOrder * aprOfA + -1 * sortOrder * aprOfB
      }
      return sortOrder * a[sortField] + -1 * sortOrder * b[sortField]
    })
  }, [sortOrder, sortField, filteredData, poolsApr]) as IDataType[]

  const renderData = useMemo(() => sortedData.slice(0, cursorVisible), [cursorVisible, sortedData])

  return (
    <Card>
      <CardHeader>
        <PoolsFilterPanel onChange={handleFilterChange} value={filters} />
      </CardHeader>
      <CardBody>
        <PoolsContent>
          {isMobile ? (
            <ListView data={renderData} />
          ) : (
            <TableView
              getRowKey={getRowKey}
              columns={columns}
              data={renderData}
              onSort={handleSort}
              sortOrder={sortOrder}
              sortField={sortField}
              onRowClick={handleRowClick}
            />
          )}
        </PoolsContent>
        {poolList.length > 0 && <div ref={observerRef} />}
      </CardBody>
      {disabledExtendPools ? null : (
        <CardFooter>
          {isPoolListExtended ? <InfoIcon width="18px" color={theme.colors.textSubtle} /> : null}
          {isPoolListExtended ? t('Search has been extended') : t('Don’t see expected pools?')}
          <Button variant="text" scale="xs" onClick={handleToggleListExpand}>
            {isPoolListExtended ? t('Reset') : t('Extend the search')}
          </Button>
        </CardFooter>
      )}
    </Card>
  )
}
