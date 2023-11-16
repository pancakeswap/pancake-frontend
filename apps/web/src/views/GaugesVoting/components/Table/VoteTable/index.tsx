import { useTranslation } from '@pancakeswap/localization'
import { Button, Card, FlexGap } from '@pancakeswap/uikit'
import { useCallback, useMemo, useState } from 'react'
import styled from 'styled-components'
import { useGaugesVotingCount } from 'views/CakeStaking/hooks/useGaugesVotingCount'
import { GaugeVoting, useGaugesVoting } from 'views/GaugesVoting/hooks/useGaugesVoting'
import { useWriteGaugesVoteCallback } from 'views/GaugesVoting/hooks/useWriteGaugesVoteCallback'
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
  const [votes, setVotes] = useState<string[]>([])

  const onGaugeAdd = (hash: GaugeVoting['hash']) => {
    if (selectRows.includes(hash)) {
      setSelectRows((prev) => prev.filter((v) => v !== hash))
    } else {
      setSelectRows((prev) => [...prev, hash])
    }
  }

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
    return sum > 100 || sum < 0 || isPending
  }, [isPending, votes])

  const submitVote = useCallback(async () => {
    const voteGauges = votes
      .map((v, i) => {
        if (v && v !== '0') {
          return {
            ...selectGauges?.[i],
            weight: Number(v) * 100,
          }
        }
        return undefined
      })
      .filter(Boolean) as GaugeVoting[]
    await writeVote(voteGauges)
  }, [selectGauges, votes, writeVote])

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
              {selectGauges.map((row, index) => (
                <TableRow key={row.hash} data={row} value={votes[index]} onChange={(v) => onVoteChange(index, v)} />
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
          <Button width="100%" disabled={disabled} onClick={submitVote}>
            Submit vote
          </Button>
        </FlexGap>
      </Card>
    </>
  )
}
