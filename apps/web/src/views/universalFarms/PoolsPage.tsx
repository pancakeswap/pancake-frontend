import flatMap from 'lodash/flatMap'
import groupBy from 'lodash/groupBy'
import { useRouter } from 'next/router'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from '@pancakeswap/localization'
import { toTokenValueByCurrency } from '@pancakeswap/widgets-internal'
import { useIntersectionObserver, useTheme } from '@pancakeswap/hooks'
import { Button, InfoIcon, SORT_ORDER, TableView, useMatchBreakpoints } from '@pancakeswap/uikit'
import { useAllTokensByChainIds } from 'hooks/Tokens'
import { PoolSortBy } from 'state/farmsV4/atom'
import { useExtendPools, useFarmPools, usePoolsApr } from 'state/farmsV4/hooks'
import { getCombinedApr } from 'state/farmsV4/state/poolApr/utils'
import type { PoolInfo } from 'state/farmsV4/state/type'
import styled from 'styled-components'

import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  getPoolDetailPageLink,
  IPoolsFilterPanelProps,
  ListView,
  PoolsFilterPanel,
  useColumnConfig,
  useSelectedPoolTypes,
} from './components'
import { useAllChainIds, useOrderChainIds } from './hooks/useMultiChains'
import { useFilterToQueries } from './hooks/useFilterToQueries'

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
  const allChainIds = useAllChainIds()
  const { selectedTypeIndex, selectedNetwork, selectedTokens, sortOrder, sortField, replaceURLQueriesByFilter } =
    useFilterToQueries()

  const poolsFilter = useMemo(
    () => ({
      selectedTypeIndex,
      selectedNetwork,
      selectedTokens,
    }),
    [selectedTypeIndex, selectedNetwork, selectedTokens],
  )

  const selectedPoolTypes = useSelectedPoolTypes(selectedTypeIndex)
  const { observerRef, isIntersecting } = useIntersectionObserver()
  const [cursorVisible, setCursorVisible] = useState(NUMBER_OF_FARMS_VISIBLE)
  const [isPoolListExtended, setIsPoolListExtended] = useState(false)

  // data source
  const { data: farmList } = useFarmPools()
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

  const poolList = useMemo(() => farmList.concat(extendPoolList), [farmList, extendPoolList])

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
        chains: selectedNetwork,
        protocols: selectedPoolTypes,
        orderBy: PoolSortBy.VOL,
      })
    }
  }, [cursorVisible, poolList, fetchPoolList, selectedPoolTypes, disabledExtendPools, selectedNetwork])

  const handleFilterChange: IPoolsFilterPanelProps['onChange'] = useCallback(
    (newFilters) => {
      resetExtendPools()
      replaceURLQueriesByFilter({
        ...poolsFilter,
        sortOrder,
        sortField,
        ...newFilters,
      })
    },
    [resetExtendPools, replaceURLQueriesByFilter, poolsFilter, sortOrder, sortField],
  )

  const handleToggleListExpand = useCallback(() => {
    setIsPoolListExtended(!isPoolListExtended)
  }, [isPoolListExtended])

  const handleSort = useCallback(
    ({ order, dataIndex }) => {
      replaceURLQueriesByFilter({
        ...poolsFilter,
        // we don't need asc sort, so reset it to null
        sortField: order === SORT_ORDER.ASC ? null : dataIndex,
        sortOrder: order === SORT_ORDER.ASC ? SORT_ORDER.NULL : order,
      })
    },
    [replaceURLQueriesByFilter, poolsFilter],
  )

  const handleRowClick = useCallback(
    (pool: PoolInfo) => {
      nextRouter.push(getPoolDetailPageLink(pool))
    },
    [nextRouter],
  )

  const getRowKey = useCallback((item: PoolInfo) => {
    return [item.chainId, item.protocol, item.pid, item.lpAddress].join(':')
  }, [])

  const filteredData = useMemo(() => {
    return poolList.filter(
      (farm) =>
        selectedNetwork.includes(farm.chainId) &&
        (!selectedTokens?.length ||
          selectedTokens?.find(
            (token) => token === toTokenValueByCurrency(farm.token0) || token === toTokenValueByCurrency(farm.token1),
          )) &&
        selectedPoolTypes.includes(farm.protocol),
    )
  }, [poolList, selectedTokens, selectedNetwork, selectedPoolTypes])

  const dataByChain = useMemo(() => {
    return groupBy(filteredData, 'chainId')
  }, [filteredData])

  const { orderedChainIds, activeChainId, othersChains } = useOrderChainIds()

  // default sorting logic: https://linear.app/pancakeswap/issue/PAN-3669/default-sorting-logic-update-for-pair-list
  const defaultSortedData = useMemo(() => {
    // active Farms: current chain -> other chains
    // ordered by farm config list
    const activeFarms = flatMap(orderedChainIds, (chainId) =>
      dataByChain[chainId]?.filter((pool) => !!pool.isActiveFarm),
    )
    // inactive Farms: current chain
    // ordered by tvlUsd
    const inactiveFarmsOfActiveChain =
      dataByChain[activeChainId]
        ?.filter((pool) => !pool.isActiveFarm)
        .sort((a, b) =>
          'tvlUsd' in a && 'tvlUsd' in b && b.tvlUsd && a.tvlUsd ? Number(b.tvlUsd) - Number(a.tvlUsd) : 1,
        ) ?? []
    // inactive Farms: other chains
    // ordered by tvlUsd
    const inactiveFarmsOfOthers = flatMap(othersChains, (chainId) =>
      dataByChain[chainId]?.filter((pool) => !pool.isActiveFarm),
    ).sort((a, b) => ('tvlUsd' in a && 'tvlUsd' in b && b.tvlUsd && a.tvlUsd ? Number(b.tvlUsd) - Number(a.tvlUsd) : 1))

    return [...activeFarms, ...inactiveFarmsOfActiveChain, ...inactiveFarmsOfOthers].filter(Boolean)
  }, [orderedChainIds, activeChainId, othersChains, dataByChain])

  const sortedData = useMemo(() => {
    if (sortField === null || sortOrder === SORT_ORDER.NULL) {
      return defaultSortedData
    }
    return [...filteredData].sort((a, b) => {
      if (sortField === 'lpApr') {
        const aprOfA = getCombinedApr(poolsApr, a.chainId, a.lpAddress)
        const aprOfB = getCombinedApr(poolsApr, b.chainId, b.lpAddress)
        return sortOrder * aprOfA + -1 * sortOrder * aprOfB
      }
      return sortOrder * Number(a[sortField]) + -1 * sortOrder * Number(b[sortField])
    })
  }, [defaultSortedData, sortOrder, sortField, filteredData, poolsApr]) as IDataType[]

  const renderData = useMemo(() => sortedData.slice(0, cursorVisible), [cursorVisible, sortedData])

  return (
    <Card>
      <CardHeader>
        <PoolsFilterPanel onChange={handleFilterChange} value={poolsFilter} />
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
