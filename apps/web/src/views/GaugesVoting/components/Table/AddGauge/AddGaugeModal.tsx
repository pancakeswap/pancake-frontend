import { Gauge, GaugeType } from '@pancakeswap/gauges'
import { useDebounce } from '@pancakeswap/hooks'
import { useTranslation } from '@pancakeswap/localization'
import {
  AutoColumn,
  Box,
  Button,
  CloseIcon,
  ColumnCenter,
  Flex,
  FlexGap,
  Grid,
  Heading,
  Input,
  ModalV2,
  ModalWrapper,
  Text,
  useMatchBreakpoints,
} from '@pancakeswap/uikit'
import { useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import { useGauges } from 'views/GaugesVoting/hooks/useGauges'
import { useGaugesTotalWeight } from 'views/GaugesVoting/hooks/useGaugesTotalWeight'
import { GaugesList, GaugesTable } from '../GaugesTable'
import { THeader, TRow } from '../styled'
import { Filter, FilterValue, Gauges, OptionsModal, OptionsType } from './OptionsModal'

const FilterButton = styled(Button)`
  height: 35px;
  border-radius: 18px;
  padding: 0 12px;
`

const ScrollableGaugesList = styled(GaugesList).attrs({ pagination: false })`
  overflow-y: auto;

  ${({ theme }) => theme.mediaQueries.sm} {
    max-height: calc(90vh - 390px);
  }
`

const AddGaugesTable = styled(GaugesTable)`
  ${THeader}, ${TRow} {
    grid-template-columns: 4fr 1.5fr 0.8fr 0.8fr;
  }
`

export const AddGaugeModal = ({ isOpen, onDismiss, selectRows, onGaugeAdd }) => {
  const { t } = useTranslation()
  const { isDesktop, isMobile } = useMatchBreakpoints()
  const totalGaugesWeight = useGaugesTotalWeight()
  const { data: gauges } = useGauges()
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
    let rows: Gauge[] = gauges

    if (debouncedSearchText?.length > 0) {
      rows = gauges.filter((gauge) => {
        return gauge.pairName.toLowerCase().includes(debouncedSearchText.toLowerCase())
      })
    }

    if (byChain.length || byFeeTier.length || byType.length) {
      rows = rows?.filter((gauge: Gauge) => {
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

    return rows
  }, [filter, gauges, debouncedSearchText])

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
    <AddGaugesTable
      selectable
      selectRows={selectRows}
      onRowSelect={onGaugeAdd}
      totalGaugesWeight={Number(totalGaugesWeight)}
      data={filterRows}
      maxHeight={70 * 5}
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
        <ModalWrapper
          maxHeight="90vh"
          minWidth={['80vw', null, null, null, null, null, '55vw']}
          height={isMobile ? '90vh' : undefined}
          style={{ overflowY: 'auto' }}
        >
          <Flex flexDirection="column" height="100%">
            <FlexGap
              flexDirection="column"
              padding={isMobile ? '16px' : '32px'}
              pb="0"
              gap={isMobile ? '20px' : '32px'}
              style={{ flex: 1, overflowY: 'hidden' }}
            >
              <FlexGap justifyContent="space-between" gap="8px" alignItems="flex-start">
                <AutoColumn>
                  <Heading>{t('Add Gauges')}</Heading>
                  <Text fontSize={14} color="textSubtle" style={{ whiteSpace: 'nowrap' }}>
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
                  {!isMobile ? (
                    <Text fontSize={12} fontWeight={600} color="textSubtle" textTransform="uppercase">
                      {t('search')}
                    </Text>
                  ) : null}
                  <Input placeholder={t('Search gauges')} onChange={(e) => setSearchText(e.target.value)} />
                </AutoColumn>
              </Grid>
              {isMobile && selectRows?.length ? (
                <Flex>
                  <Text fontSize={14} bold color="secondary" textTransform="uppercase">
                    {selectRows?.length} {t('selected')}
                  </Text>
                  <Text ml="2px" fontSize={14} bold color="textSubtle" textTransform="uppercase">
                    / {gauges?.length} {t('total')}
                  </Text>
                </Flex>
              ) : null}
              <Box style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden' }}>{gaugesTable}</Box>
            </FlexGap>
            <BottomAction pb="32px" style={{ marginTop: 'auto' }} onClick={onDismiss}>
              <Button width={isMobile ? '100%' : '50%'}>{t(isMobile ? 'Continue' : 'Finish')}</Button>
            </BottomAction>
          </Flex>
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

const BottomAction = styled(ColumnCenter)`
  flex: 0;
  padding: calc(16px + env(safe-area-inset-bottom));

  ${({ theme }) => theme.mediaQueries.sm} {
    padding: 0;
    padding-bottom: 32px;
  }
`
