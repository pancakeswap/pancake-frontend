import { ChainId, chainNames } from '@pancakeswap/chains'
import { GAUGE_TYPE_NAMES, Gauge, GaugeType } from '@pancakeswap/gauges'
import { useIsMounted } from '@pancakeswap/hooks'
import { FeeAmount } from '@pancakeswap/v3-sdk'
import { useSearchParams } from 'next/navigation'
import { useRouter } from 'next/router'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Filter, FilterValue, Gauges, OptionsType, SortOptions } from '../components/GaugesFilter'
import { getPositionManagerName } from '../utils'

const getSorter = (sort: SortOptions | undefined) => {
  if (sort === SortOptions.Vote) {
    return (a: Gauge, b: Gauge) => Number(b.weight) - Number(a.weight)
  }
  if (sort === SortOptions.Boost) {
    return (a: Gauge, b: Gauge) => Number(b.boostMultiplier) - Number(a.boostMultiplier)
  }
  return (a: Gauge, b: Gauge) => Number(a.gid) - Number(b.gid)
}

export const useGaugesFilter = (fullGauges: Gauge[] | undefined, urlQuerySync = false) => {
  const [searchText, _setSearchText] = useState<string>('')
  const [filter, setFilter] = useState<Filter>({
    byChain: [],
    byFeeTier: [],
    byType: [],
  })
  const isFilterEmpty = useMemo(() => Object.values(filter).every((v) => v.length === 0), [filter])
  const isSearchTextEmpty = useMemo(() => searchText?.length === 0, [searchText])
  const [sort, setSort] = useState<SortOptions>()
  const searchParams = useSearchParams()
  const isMounted = useIsMounted()
  const router = useRouter()
  const initRef = useRef(false)

  const updateSearchQuery = useCallback(
    (obj: Record<string, string[] | string>) => {
      const search = new URLSearchParams(searchParams.toString())
      Object.entries(obj).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          search.delete(key)
          if (value.length > 0) {
            value.forEach((v) => search.append(key, v))
          }
        } else if (value) {
          search.set(key, value)
        } else {
          search.delete(key)
        }
      })

      const searchString = search.toString().length ? `?${search.toString()}` : ''

      router.replace(router.pathname, searchString, { shallow: true })
    },
    [router, searchParams],
  )

  const setSearchText = useCallback(
    (text: string) => {
      _setSearchText(text)
      if (urlQuerySync) {
        updateSearchQuery({ q: text })
      }
    },
    [updateSearchQuery, urlQuerySync],
  )

  useEffect(() => {
    if (router.isReady && !initRef.current && urlQuerySync && searchParams.size > 0) {
      initRef.current = true
      if (isFilterEmpty) {
        const search = new URLSearchParams(searchParams.toString())
        const filterByChain = search.getAll('byChain').map((v) => Number(v)) as ChainId[]
        const filterByFeeTier = search.getAll('byFeeTier').map((v) => Number(v)) as FeeAmount[]
        const filterByType = search.getAll('byType') as Gauges[]

        setFilter({
          byChain: filterByChain,
          byFeeTier: filterByFeeTier,
          byType: filterByType,
        })
      }
      if (isSearchTextEmpty) {
        const search = new URLSearchParams(searchParams.toString())
        const q = search.get('q')
        setSearchText(q || '')
      }
    }
  }, [isFilterEmpty, isMounted, isSearchTextEmpty, router.isReady, searchParams, setSearchText, urlQuerySync])

  const onFilterChange = useCallback(
    (type: OptionsType, value: FilterValue) => {
      const opts = filter[type] as Array<unknown>
      let newFilter: Filter | undefined
      // select all
      if (Array.isArray(value)) {
        setFilter((prev) => {
          newFilter = {
            ...prev,
            [type]: value.length === opts.length ? [] : value,
          }
          return newFilter
        })
      } else if (opts.includes(value)) {
        // select one
        setFilter((prev) => {
          newFilter = {
            ...prev,
            [type]: opts.filter((v) => v !== value),
          }
          return newFilter
        })
      } else {
        setFilter((prev) => {
          newFilter = {
            ...prev,
            [type]: [...opts, value],
          }
          return newFilter
        })
      }

      if (urlQuerySync && newFilter) {
        updateSearchQuery(JSON.parse(JSON.stringify(newFilter)))
      }
    },
    [filter, updateSearchQuery, urlQuerySync],
  )

  const filterGauges = useMemo(() => {
    if (!fullGauges || !fullGauges.length) return []
    const { byChain, byFeeTier, byType } = filter
    let results: Gauge[] = fullGauges

    if (byChain.length || byFeeTier.length || byType.length) {
      results = results.filter((gauge: Gauge) => {
        const feeTier = gauge.type === GaugeType.V3 ? gauge?.feeTier : undefined
        const chain = gauge.chainId
        const boosted = gauge.boostMultiplier > 100n
        const capped = gauge.maxVoteCap > 0n
        const types = [boosted ? Gauges.Boosted : Gauges.Regular]
        if (capped) {
          types.push(Gauges.Capped)
        }
        return (
          (byChain.length === 0 || (chain && byChain.includes(chain))) &&
          (byFeeTier.length === 0 || (feeTier && byFeeTier.includes(feeTier))) &&
          (byType.length === 0 || byType.some((bt) => types.includes(bt)))
        )
      })
    }

    if (searchText?.length > 0) {
      results = results.filter((gauge) => {
        return [
          // search by pairName or tokenName
          gauge.pairName.toLowerCase(),
          // search by gauges type, e.g. "v2", "v3", "position manager"
          GAUGE_TYPE_NAMES[gauge.type].toLowerCase(),
          // search by chain name
          chainNames[gauge.chainId],
          // search by chain id
          String(gauge.chainId),
          // search by boost multiplier, e.g. "1.5x"
          `${Number(gauge.boostMultiplier) / 100}x`,
          // search by alm strategy name
          getPositionManagerName(gauge).toLowerCase(),
        ].some((text) => text?.includes(searchText.toLowerCase()))
      })
    }

    const sorter = getSorter(sort)
    results = results.sort(sorter)

    return results
  }, [filter, fullGauges, searchText, sort])

  useEffect(() => {
    if (fullGauges && fullGauges.length && !sort) {
      setSort(SortOptions.Default)
    }
  }, [fullGauges, sort])

  return {
    filterGauges,

    searchText,
    setSearchText,

    filter,
    setFilter,
    onFilterChange,

    sort,
    setSort,
  }
}
