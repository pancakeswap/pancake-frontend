import styled from 'styled-components'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from '@pancakeswap/localization'
import { toTokenValueByCurrency } from '@pancakeswap/widgets-internal'
import { Protocol, UNIVERSAL_FARMS } from '@pancakeswap/farms'
import { useIntersectionObserver, useTheme } from '@pancakeswap/hooks'
import { Button, Image, InfoIcon, ISortOrder, SORT_ORDER, TableView, useMatchBreakpoints } from '@pancakeswap/uikit'
import { useAllTokensByChainIds } from 'hooks/Tokens'
import { PoolSortBy } from 'state/farmsV4/atom'
import { useExtendPools, useFarmPools, usePoolsApr } from 'state/farmsV4/hooks'
import { getCombinedApr } from 'state/farmsV4/state/poolApr/utils'
import type { PoolInfo } from 'state/farmsV4/state/type'
import { getChainName } from '@pancakeswap/chains'
import { LegacyRouter } from '@pancakeswap/smart-router/legacy-router'
import { isAddressEqual } from 'viem'

import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  IPoolsFilterPanelProps,
  ListView,
  MAINNET_CHAINS,
  PoolsFilterPanel,
  useColumnConfig,
  useSelectedPoolTypes,
} from './components'

type IDataType = PoolInfo

const PoolsContent = styled.div`
  min-height: calc(100vh - 64px - 56px);
`

const StyledImage = styled(Image)`
  margin-left: auto;
  margin-right: auto;
  margin-top: 58px;
`

const NUMBER_OF_FARMS_VISIBLE = 20

export const PoolsPage = () => {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const { isMobile } = useMatchBreakpoints()

  const columns = useColumnConfig<IDataType>()
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

  const poolList = useMemo(
    () =>
      fetchFarmListLoaded && farmList.length
        ? farmList.concat(
          isPoolListExtended
            ? extendPools
            : extendPools.filter(
              (pool) =>
                // non farming list need to do a whitelist filter
                pool.token0.wrapped.address in allTokenMap[pool.chainId] &&
                pool.token1.wrapped.address in allTokenMap[pool.chainId],
            ),
        )
        : UNIVERSAL_FARMS,
    [fetchFarmListLoaded, farmList, extendPools, allTokenMap, isPoolListExtended],
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

  const getRowLink = useCallback((pool: PoolInfo) => {
    if (pool.protocol === Protocol.STABLE) {
      const stablePair = LegacyRouter.stableSwapPairsByChainId[pool.chainId]?.find((pair) =>
        isAddressEqual(pair.lpAddress, pool.lpAddress),
      )
      return `/pools/${getChainName(pool.chainId)}/${stablePair?.stableSwapAddress}`
    }
    return `/pools/${getChainName(pool.chainId)}/${pool.lpAddress}`
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
            <ListView data={sortedData} />
          ) : (
            <TableView
              rowKey="lpAddress"
              columns={columns}
              data={renderData}
              onSort={handleSort}
              sortOrder={sortOrder}
              sortField={sortField}
              getRowLink={getRowLink}
            />
          )}
        </PoolsContent>
        {poolList.length > 0 && <div ref={observerRef} />}
        <StyledImage src="/images/decorations/3dpan.png" alt="Pancake illustration" width={120} height={103} />
      </CardBody>
      <CardFooter>
        {isPoolListExtended ? <InfoIcon width="18px" color={theme.colors.textSubtle} /> : null}
        {isPoolListExtended ? t('Search has been extended') : t('Don’t see expected pools?')}
        <Button variant="text" scale="xs" onClick={handleToggleListExpand}>
          {isPoolListExtended ? t('Reset') : t('Extend the search')}
        </Button>
      </CardFooter>
    </Card>
  )
}
