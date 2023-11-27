import { useDebounce } from '@pancakeswap/hooks'
import { useTranslation } from '@pancakeswap/localization'
import {
  AutoColumn,
  Box,
  Button,
  CloseIcon,
  ColumnCenter,
  FlexGap,
  Grid,
  Heading,
  Input,
  ModalV2,
  ModalWrapper,
  Text,
  useMatchBreakpoints,
} from '@pancakeswap/uikit'
import { GaugeType } from 'config/constants/types'
import { useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import { useGaugesPresets } from 'views/GaugesVoting/hooks/useGaugesPresets'
import { useGaugesTotalWeight } from 'views/GaugesVoting/hooks/useGaugesTotalWeight'
import { GaugeVoting, useGaugesVoting } from 'views/GaugesVoting/hooks/useGaugesVoting'
import { getGaugeHash } from 'views/GaugesVoting/utils'
import { GaugesList, GaugesTable } from '../GaugesTable'
import { Filter, FilterValue, Gauges, OptionsModal, OptionsType } from './OptionsModal'

const FilterButton = styled(Button)`
  height: 35px;
  border-radius: 18px;
  padding: 0 12px;
`

const ScrollableGaugesList = styled(GaugesList).attrs({ pagination: false })`
  max-height: calc(90vh - 390px);
  overflow-y: auto;
`

export const AddGaugeModal = ({ isOpen, onDismiss, selectRows, onGaugeAdd }) => {
  const { t } = useTranslation()
  const { isDesktop } = useMatchBreakpoints()
  const totalGaugesWeight = useGaugesTotalWeight()
  const { data: gauges } = useGaugesVoting()
  const presets = useGaugesPresets()
  const [searchText, setSearchText] = useState<string>('')
  const debouncedSearchText = useDebounce(searchText, 800)
  const [option, setOption] = useState<OptionsType | null>(null)
  const [filter, setFilter] = useState<Filter>({
    byChain: [],
    byFeeTier: [],
    byType: [],
  })

  const filterRows = useMemo(() => {
    if (!gauges || !gauges.length) return []
    const { byChain, byFeeTier, byType } = filter
    let rows: GaugeVoting[] = gauges

    if (debouncedSearchText?.length > 0) {
      rows = gauges.filter((gauge) => {
        const config = presets.find((g) => gauge.hash === getGaugeHash(g.address, g.chainId))
        const pairName = config?.pairName
        return pairName?.toLowerCase().includes(debouncedSearchText.toLowerCase())
      })
    }

    if (byChain.length || byFeeTier.length || byType.length) {
      rows = rows?.filter((gauge: GaugeVoting) => {
        const config = presets.find((g) => gauge.hash === getGaugeHash(g.address, g.chainId))
        const feeTier = config?.type === GaugeType.V3 ? config?.feeTier : undefined
        const chain = config?.chainId
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

    return rows
  }, [filter, gauges, presets, debouncedSearchText])

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

  const gaugesTable = isDesktop ? (
    <GaugesTable
      selectable
      selectRows={selectRows}
      onRowSelect={onGaugeAdd}
      totalGaugesWeight={Number(totalGaugesWeight)}
      data={filterRows}
      scrollStyle={{ maxHeight: '40vh' }}
    />
  ) : (
    <ScrollableGaugesList
      selectable
      selectRows={selectRows}
      onRowSelect={onGaugeAdd}
      totalGaugesWeight={Number(totalGaugesWeight)}
      data={filterRows}
      listDisplay="card"
    />
  )

  useEffect(() => {
    if (!isOpen) {
      setSearchText('')
      setFilter({
        byChain: [],
        byFeeTier: [],
        byType: [],
      })
    }
  }, [isOpen])

  return (
    <>
      <ModalV2 isOpen={isOpen} onDismiss={onDismiss}>
        <ModalWrapper maxHeight="90vh" style={{ overflowY: 'auto' }}>
          <FlexGap flexDirection="column" padding={32} gap="32px">
            <FlexGap justifyContent="space-between" gap="8px" alignItems="flex-start">
              <AutoColumn>
                <Heading>{t('Add Gauges')}</Heading>
                <Text fontSize={14} color="textSubtle">
                  {t('Search and add the gauge you want to vote')}
                </Text>
              </AutoColumn>
              <Button variant="text" onClick={onDismiss} px={0} height="fit-content">
                <CloseIcon color="textSubtle" />
              </Button>
            </FlexGap>
            <Grid gridTemplateColumns={isDesktop ? '1fr 1fr' : '1fr'} gridGap={isDesktop ? '32px' : '1em'}>
              <AutoColumn gap="4px">
                <Text fontSize={12} fontWeight={600} color="textSubtle" textTransform="uppercase">
                  {t('filter')}
                </Text>
                <FlexGap gap="10px">
                  <FilterButton variant="light" onClick={() => setOption(OptionsType.ByChain)}>
                    {t('Chain')}
                  </FilterButton>
                  <FilterButton variant="light" onClick={() => setOption(OptionsType.ByFeeTier)}>
                    {t('Fee Tier')}
                  </FilterButton>
                  <FilterButton variant="light" onClick={() => setOption(OptionsType.ByType)}>
                    {t('Type')}
                  </FilterButton>
                </FlexGap>
              </AutoColumn>
              <AutoColumn gap="4px">
                <Text fontSize={12} fontWeight={600} color="textSubtle" textTransform="uppercase">
                  {t('search')}
                </Text>
                <Input placeholder={t('Search gauges')} onChange={(e) => setSearchText(e.target.value)} />
              </AutoColumn>
            </Grid>
            <Box>{gaugesTable}</Box>
            <ColumnCenter style={{ marginTop: 'auto' }} onClick={onDismiss}>
              <Button width="50%">{t('Finish')}</Button>
            </ColumnCenter>
          </FlexGap>
        </ModalWrapper>
      </ModalV2>
      <OptionsModal
        isOpen={Boolean(option)}
        onDismiss={() => setOption(null)}
        type={option}
        options={filter}
        onChange={onFilterChange}
      />
    </>
  )
}
