import { useTranslation } from '@pancakeswap/localization'
import { Button, Card, FlexGap } from '@pancakeswap/uikit'
import { useMemo, useState } from 'react'
import styled from 'styled-components'
import { useGaugesVotingCount } from 'views/CakeStaking/hooks/useGaugesVotingCount'
import { GaugeVoting, useGaugesVoting } from 'views/GaugesVoting/hooks/useGaugesVoting'
import { AddGaugeModal } from '../AddGauge/AddGaugeModal'
import { EmptyTable } from './EmptyTable'
import { TableHeader } from './TableHeader'
import { ExpandRow, TableRow } from './TableRow'

const Scrollable = styled.div.withConfig({ shouldForwardProp: (prop) => !['expanded'].includes(prop) })<{
  expanded: boolean
}>`
  overflow-y: auto;
  height: ${({ expanded }) => (expanded ? 'auto' : '210px')};
`

export const VoteTable = () => {
  const { t } = useTranslation()
  const gaugesCount = useGaugesVotingCount()
  const [isOpen, setIsOpen] = useState(false)
  const [selectRows, setSelectRows] = useState<GaugeVoting['hash'][]>([])
  const gauges = useGaugesVoting()
  const selectGauges = useMemo(() => {
    return gauges?.filter((gauge) => selectRows.includes(gauge.hash))
  }, [gauges, selectRows])
  const [expanded, setExpanded] = useState(false)
  const [votes, setVotes] = useState<number[]>([])

  const onGaugeAdd = (hash: GaugeVoting['hash']) => {
    if (selectRows.includes(hash)) {
      setSelectRows((prev) => prev.filter((v) => v !== hash))
    } else {
      setSelectRows((prev) => [...prev, hash])
    }
  }
  return (
    <>
      <AddGaugeModal
        selectRows={selectRows}
        onGaugeAdd={onGaugeAdd}
        isOpen={isOpen}
        onDismiss={() => setIsOpen(false)}
      />
      <Card innerCardProps={{ padding: '32px', paddingTop: '16px' }} mt={32}>
        <TableHeader count={selectGauges?.length} />

        {selectGauges?.length ? (
          <>
            <Scrollable expanded={expanded}>
              {selectGauges.map((row) => (
                <TableRow key={row.hash} data={row} />
              ))}
            </Scrollable>
            {selectGauges?.length > 3 ? (
              <ExpandRow text={t('Show all')} onCollapse={() => setExpanded(!expanded)} />
            ) : null}
          </>
        ) : (
          <EmptyTable />
        )}

        <FlexGap gap="12px" style={{ marginTop: selectGauges && selectGauges?.length > 3 ? 0 : '8px' }}>
          <Button width="100%" onClick={() => setIsOpen(true)}>
            + Add Gauges ({gaugesCount?.toString()})
          </Button>
          <Button width="100%">Submit vote</Button>
        </FlexGap>
      </Card>
    </>
  )
}
