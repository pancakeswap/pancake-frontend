import { useTranslation } from '@pancakeswap/localization'
import { Button, Card, FlexGap, useMatchBreakpoints } from '@pancakeswap/uikit'
import { useCallback, useMemo, useState } from 'react'
import styled from 'styled-components'
import { useGaugesVotingCount } from 'views/CakeStaking/hooks/useGaugesVotingCount'
import { GaugeVoting } from 'views/GaugesVoting/hooks/useGaugesVoting'
import { useWriteGaugesVoteCallback } from 'views/GaugesVoting/hooks/useWriteGaugesVoteCallback'
import { AddGaugeModal } from '../AddGauge/AddGaugeModal'
import { EmptyTable } from './EmptyTable'
import { VoteListItem } from './List'
import { TableHeader } from './TableHeader'
import { ExpandRow, TableRow } from './TableRow'
import { useGaugeRows } from './hooks/useGaugeRows'
import { MaxVote, UserVote } from './types'

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
  const [votes, setVotes] = useState<UserVote[]>([])
  const voteSum = useMemo(() => {
    return votes.reduce((acc, cur) => acc + Number(cur?.power), 0)
  }, [votes])

  const { rows, onRowAdd, refetch } = useGaugeRows()
  const { isDesktop } = useMatchBreakpoints()

  const onVoteChange = (index: number, value: MaxVote | UserVote) => {
    const newVotes = [...votes]
    if (!newVotes[index]) {
      newVotes[index] = {
        power: '',
        locked: false,
      }
    }
    if (value === 'MAX_VOTE') {
      const sum = voteSum - Number(newVotes[index].power || 0)
      newVotes[index].power = 100 - sum > 0 ? String(100 - sum) : '0'
    } else {
      newVotes[index] = value
    }
    setVotes(newVotes)
  }

  const { writeVote, isPending } = useWriteGaugesVoteCallback()

  const disabled = useMemo(() => {
    return voteSum > 100 || voteSum < 0 || isPending
  }, [isPending, voteSum])
  const leftGaugesCanAdd = useMemo(() => {
    return Number(gaugesCount) - (rows?.length || 0)
  }, [gaugesCount, rows])

  const submitVote = useCallback(async () => {
    const voteGauges = votes
      .map((vote, i) => {
        if (!vote.locked && Number(vote.power)) {
          return {
            ...rows?.[i],
            weight: Number(vote.power) * 100,
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
              <TableRow key={row.hash} data={row} vote={votes[index]} onChange={(v) => onVoteChange(index, v)} />
            ))}
          </Scrollable>
          {rows?.length > 3 ? <ExpandRow text={t('Show all')} onCollapse={() => setExpanded(!expanded)} /> : null}
        </>
      ) : (
        <EmptyTable />
      )}
    </>
  ) : (
    <>
      {rows?.length ? (
        rows.map((row, index) => (
          <VoteListItem key={row.hash} data={row} vote={votes[index]} onChange={(v) => onVoteChange(index, v)} />
        ))
      ) : (
        <EmptyTable />
      )}
    </>
  )

  return (
    <>
      <AddGaugeModal selectRows={rows} onGaugeAdd={onRowAdd} isOpen={isOpen} onDismiss={() => setIsOpen(false)} />
      <Card innerCardProps={{ padding: isDesktop ? '2em' : '0', paddingTop: isDesktop ? '1em' : '0' }} mt="2em">
        {gauges}

        <FlexGap
          gap="12px"
          padding={isDesktop ? '2em' : '1em'}
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
