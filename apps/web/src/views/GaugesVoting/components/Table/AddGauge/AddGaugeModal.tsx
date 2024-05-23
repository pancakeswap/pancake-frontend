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
  ModalV2,
  ModalWrapper,
  Text,
  useMatchBreakpoints,
} from '@pancakeswap/uikit'
import styled from 'styled-components'
import { useGauges } from 'views/GaugesVoting/hooks/useGauges'
import { useGaugesFilter } from 'views/GaugesVoting/hooks/useGaugesFilter'
import { useGaugesTotalWeight } from 'views/GaugesVoting/hooks/useGaugesTotalWeight'
import { FilterFieldByType, FilterFieldInput, FilterFieldSort } from '../../GaugesFilter'
import { GaugesList, GaugesTable } from '../GaugesTable'
import { THeader, TRow } from '../styled'

const ScrollableGaugesList = styled(GaugesList).attrs({ pagination: false })`
  overflow-y: auto;

  ${({ theme }) => theme.mediaQueries.sm} {
    max-height: calc(90vh - 390px);
  }
`

const AddGaugesTable = styled(GaugesTable)`
  ${THeader}, ${TRow} {
    grid-template-columns: 2fr 1.5fr 1.5fr 0.8fr 0.8fr;
  }
`

export const AddGaugeModal = ({ isOpen, onDismiss, selectRows, onGaugeAdd }) => {
  const { t } = useTranslation()
  const { isDesktop, isMobile } = useMatchBreakpoints()
  const totalGaugesWeight = useGaugesTotalWeight()
  const { data: gauges } = useGauges()
  const { filterGauges, setSearchText, filter, setFilter, setSort } = useGaugesFilter(gauges)

  const gaugesTable = isDesktop ? (
    <AddGaugesTable
      selectable
      selectRows={selectRows}
      onRowSelect={onGaugeAdd}
      totalGaugesWeight={Number(totalGaugesWeight)}
      data={filterGauges}
      maxHeight={70 * 5}
    />
  ) : (
    <ScrollableGaugesList
      selectable
      selectRows={selectRows}
      onRowSelect={onGaugeAdd}
      totalGaugesWeight={Number(totalGaugesWeight)}
      data={filterGauges}
      listDisplay="card"
    />
  )

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
                <Grid gridTemplateColumns="2fr 1fr" gridGap="8px">
                  <FilterFieldByType onFilterChange={setFilter} value={filter} />
                  <FilterFieldSort onChange={setSort} />
                </Grid>
                <FilterFieldInput placeholder={t('Search gauges')} onChange={setSearchText} hideLabel={isMobile} />
              </Grid>
              {isMobile && selectRows?.length ? (
                <Flex>
                  <Text fontSize={14} bold color="secondary" textTransform="uppercase">
                    {selectRows?.length} {t('selected')}
                  </Text>
                  <Text ml="2px" fontSize={14} bold color="textSubtle" textTransform="uppercase">
                    / {filterGauges?.length} {t('total')}
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
