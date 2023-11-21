import { useTranslation } from '@pancakeswap/localization'
import { Button, Card, FlexGap, useMatchBreakpoints } from '@pancakeswap/uikit'
import { useCallback, useMemo, useState } from 'react'
import styled from 'styled-components'
import { useGaugesVotingCount } from 'views/CakeStaking/hooks/useGaugesVotingCount'
import { GaugeVoting } from 'views/GaugesVoting/hooks/useGaugesVoting'
import { useVotedPower } from 'views/GaugesVoting/hooks/useVotedPower'
import { useWriteGaugesVoteCallback } from 'views/GaugesVoting/hooks/useWriteGaugesVoteCallback'
import { AddGaugeModal } from '../AddGauge/AddGaugeModal'
import { EmptyTable } from './EmptyTable'
import { TableHeader } from './TableHeader'
import { ExpandRow, TableRow } from './TableRow'
import { useGaugeRows } from './hooks/useGaugeRows'

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
  const [expanded, setExpanded] = useState(false)
  const [votes, setVotes] = useState<string[]>([])
  const votedPower = useVotedPower()
  const { rows, onRowAdd, refetch } = useGaugeRows()
  const { isDesktop } = useMatchBreakpoints()

  const onVoteChange = (index: number, value: string) => {
    const newVotes = [...votes]
    if (value === '100') {
      newVotes.fill('0')
    }
    newVotes[index] = value
    setVotes(newVotes)
  }

  const { writeVote, isPending } = useWriteGaugesVoteCallback()

  const disabled = useMemo(() => {
    const sum = votes.reduce((acc, cur) => acc + Number(cur), 0)
    return sum > 100 || sum < 0 || isPending || votedPower === 10000
  }, [isPending, votedPower, votes])
  const leftGaugesCanAdd = useMemo(() => {
    return Number(gaugesCount) - (rows?.length || 0)
  }, [gaugesCount, rows])

  const submitVote = useCallback(async () => {
    const voteGauges = votes
      .map((v, i) => {
        if (v && v !== '0') {
          return {
            ...rows?.[i],
            weight: Number(v) * 100,
          }
        }
        return undefined
      })
      .filter(Boolean) as GaugeVoting[]
    await writeVote(voteGauges)
    await refetch()
  }, [refetch, rows, votes, writeVote])

  const gauges = isDesktop ? (
    <>
      <TableHeader count={rows?.length} />

      {rows?.length ? (
        <>
          <Scrollable expanded={expanded}>
            {rows.map((row, index) => (
              <TableRow key={row.hash} data={row} value={votes[index]} onChange={(v) => onVoteChange(index, v)} />
            ))}
          </Scrollable>
          {rows?.length > 3 ? <ExpandRow text={t('Show all')} onCollapse={() => setExpanded(!expanded)} /> : null}
        </>
      ) : (
        <EmptyTable />
      )}
    </>
  ) : null

  return (
    <>
      <AddGaugeModal selectRows={rows} onGaugeAdd={onRowAdd} isOpen={isOpen} onDismiss={() => setIsOpen(false)} />
      <Card innerCardProps={{ padding: '32px', paddingTop: '16px' }} mt={32}>
        {gauges}

        <FlexGap
          flexDirection={isDesktop ? 'row' : 'column'}
          gap="12px"
          style={{ marginTop: rows && rows?.length > 3 ? 0 : '8px' }}
        >
          <Button width="100%" onClick={() => setIsOpen(true)}>
            + Add Gauges ({leftGaugesCanAdd})
          </Button>
          <Button width="100%" disabled={disabled} onClick={submitVote}>
            Submit vote
          </Button>
        </FlexGap>
      </Card>
    </>
  )
}
