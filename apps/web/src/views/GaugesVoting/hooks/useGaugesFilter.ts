import { chainNames } from '@pancakeswap/chains'
import { GAUGE_TYPE_NAMES, Gauge, GaugeType } from '@pancakeswap/gauges'
import { useCallback, useEffect, useMemo, useState } from 'react'
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

export const useGaugesFilter = (fullGauges: Gauge[] | undefined) => {
  const [searchText, setSearchText] = useState<string>('')
  const [filter, setFilter] = useState<Filter>({
    byChain: [],
    byFeeTier: [],
    byType: [],
  })
  const [sort, setSort] = useState<SortOptions>()

  const onFilterChange = useCallback(
    (type: OptionsType, value: FilterValue) => {
      const opts = filter[type] as Array<unknown>

      // select all
      if (Array.isArray(value)) {
        setFilter((prev) => ({
          ...prev,
          [type]: value.length === opts.length ? [] : value,
        }))
        return
      }
      // select one
      if (opts.includes(value)) {
        setFilter((prev) => ({
          ...prev,
          [type]: opts.filter((v) => v !== value),
        }))
      } else {
        setFilter((prev) => ({
          ...prev,
          [type]: [...opts, value],
        }))
      }
    },
    [filter],
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
