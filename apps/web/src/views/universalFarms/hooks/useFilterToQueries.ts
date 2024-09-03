import { useCallback, useEffect, useMemo } from 'react'
import intersection from 'lodash/intersection'
import { isAddress } from 'viem'
import { useRouter } from 'next/router'
import { SORT_ORDER } from '@pancakeswap/uikit'
import { useAllTokensByChainIds } from 'hooks/Tokens'
import { PoolInfo } from 'state/farmsV4/state/type'
import { IPoolsFilterPanelProps } from '../components'
import { useAllChainIds } from './useMultiChains'

export enum V3_STATUS {
  ALL,
  ACTIVE,
  INACTIVE,
  CLOSED,
}

type filtersParams = Partial<
  IPoolsFilterPanelProps['value'] & {
    sortOrder: SORT_ORDER
    sortField: keyof PoolInfo | null
    positionStatus: V3_STATUS
    farmsOnly: boolean
  }
>

export const useFilterToQueries = () => {
  const nextRouter = useRouter()
  const allChainIds = useAllChainIds()
  const allTokensMap = useAllTokensByChainIds(allChainIds)

  const {
    type,
    network,
    token: queryTokenParams,
    sort,
    status,
    farmsOnly: queryFarmsOnly,
    ...othersQueries
  } = nextRouter.query

  const positionStatus = useMemo(
    () => (status ? Number(Array.isArray(status) ? status[0] : status) : V3_STATUS.ACTIVE),
    [status],
  )

  const farmsOnly = useMemo(
    () => (queryFarmsOnly ? !!Number(Array.isArray(queryFarmsOnly) ? queryFarmsOnly[0] : queryFarmsOnly) : false),
    [queryFarmsOnly],
  )

  const selectedTypeIndex = useMemo(() => (type ? Number(Array.isArray(type) ? type[0] : type) : 0), [type])

  const selectedNetwork = useMemo(
    () => (network ? (Array.isArray(network) ? network : [network]).map((i) => Number(i)) : allChainIds),
    [network, allChainIds],
  )
  const selectedTokens = useMemo(() => {
    const queryTokens = queryTokenParams
      ? Array.isArray(queryTokenParams)
        ? queryTokenParams
        : [queryTokenParams]
      : []
    return queryTokens.filter((t) => {
      const [chainId, tokenAddress] = t.split(':')
      return !!(isAddress(tokenAddress) && allTokensMap[chainId]?.[tokenAddress])
    })
  }, [queryTokenParams, allTokensMap])
  const [sortOrder, sortField] = useMemo(() => {
    if (!sort) {
      return [SORT_ORDER.NULL, null]
    }
    const [field, order] = (Array.isArray(sort) ? sort[0] : sort).split(':')
    return [Number(order), field as keyof PoolInfo | null]
  }, [sort])

  const replaceURLQueriesByFilter = useCallback(
    (filters: filtersParams) => {
      const params: { [key: string]: string | string[] } = {}
      if (typeof filters.positionStatus !== 'undefined' && filters.positionStatus !== V3_STATUS.ACTIVE) {
        params.status = filters.positionStatus.toString()
      }
      if (filters.selectedTypeIndex && filters.selectedTypeIndex !== 0) {
        params.type = filters.selectedTypeIndex.toString()
      }
      if (filters.farmsOnly) {
        params.farmsOnly = '1'
      }
      if (filters.sortOrder && filters.sortField) {
        params.sort = `${filters.sortField}:${filters.sortOrder}`
      }
      if (filters.selectedNetwork && filters.selectedNetwork.length !== allChainIds.length) {
        params.network = filters.selectedNetwork.map((i) => i.toString())
      }
      // Tokens might be too long, so keep them at the end to prevent other queries from being cut off by the browser.
      if (filters.selectedTokens?.length) {
        params.token = filters.selectedTokens
      }
      nextRouter.replace(
        {
          query: {
            ...othersQueries,
            ...params,
          },
        },
        undefined,
        {
          shallow: true,
          scroll: false,
        },
      )
    },
    [othersQueries, nextRouter, allChainIds.length],
  )

  useEffect(() => {
    const queriesReset: filtersParams = {}
    if (Array.isArray(status)) {
      queriesReset.positionStatus = positionStatus
    }
    if (!Object.values(V3_STATUS).includes(positionStatus)) {
      queriesReset.positionStatus = V3_STATUS.ACTIVE
    }

    if (Array.isArray(type)) {
      queriesReset.selectedTypeIndex = selectedTypeIndex
    }
    if (![0, 1, 2, 3].includes(selectedTypeIndex)) {
      queriesReset.selectedTypeIndex = 0
    }

    if (!selectedNetwork.every((i) => allChainIds.includes(i))) {
      queriesReset.selectedNetwork = intersection(allChainIds, selectedNetwork)
    }

    if (Array.isArray(sort)) {
      queriesReset.sortOrder = sortOrder
      queriesReset.sortField = sortField
    }
    if (!Object.values(SORT_ORDER).includes(sortOrder)) {
      queriesReset.sortOrder = SORT_ORDER.NULL
      queriesReset.sortField = null
    }

    if (Array.isArray(queryFarmsOnly)) {
      queriesReset.farmsOnly = farmsOnly
    }

    const queryTokens = Array.isArray(queryTokenParams) ? queryTokenParams : queryTokenParams ? [queryTokenParams] : []
    if (queryTokens.length !== selectedTokens.length) {
      queriesReset.selectedTokens = selectedTokens
    }

    if (Object.keys(queriesReset).length) {
      replaceURLQueriesByFilter({
        selectedTypeIndex,
        selectedNetwork,
        selectedTokens,
        sortOrder,
        sortField,
        positionStatus,
        farmsOnly,
        ...queriesReset,
      })
    }
  }, [
    queryFarmsOnly,
    sort,
    status,
    type,
    positionStatus,
    replaceURLQueriesByFilter,
    selectedTypeIndex,
    selectedNetwork,
    selectedTokens,
    sortOrder,
    sortField,
    farmsOnly,
    allChainIds,
    queryTokenParams,
  ])

  return {
    selectedTypeIndex,
    selectedNetwork,
    selectedTokens,
    sortOrder,
    sortField,
    positionStatus,
    farmsOnly,
    replaceURLQueriesByFilter,
  }
}
