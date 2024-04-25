import { chainNames } from '@pancakeswap/chains'
import { GAUGE_TYPE_NAMES, Gauge, GaugeType } from '@pancakeswap/gauges'
import { useMemo, useState } from 'react'
import { Filter, FilterValue, Gauges, OptionsType } from '../components/GaugesFilter'

export const useFilter = (fullGauges: Gauge[] | undefined) => {
  const [searchText, setSearchText] = useState<string>('')
  const [filter, setFilter] = useState<Filter>({
    byChain: [],
    byFeeTier: [],
    byType: [],
  })

  const onFilterChange = (type: OptionsType, value: FilterValue) => {
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
  }

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
          gauge.pairName.toLowerCase(),
          GAUGE_TYPE_NAMES[gauge.type].toLowerCase(),
          chainNames[gauge.chainId],
          String(gauge.chainId),
          `${Number(gauge.boostMultiplier) / 100}x`,
        ].some((text) => text.includes(searchText.toLowerCase()))
      })
    }

    return results
  }, [filter, fullGauges, searchText])

  return {
    filterGauges,

    searchText,
    setSearchText,

    filter,
    setFilter,
    onFilterChange,
  }
}
