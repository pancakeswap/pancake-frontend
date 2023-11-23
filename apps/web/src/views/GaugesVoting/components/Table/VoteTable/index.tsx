import { useTranslation } from '@pancakeswap/localization'
import { AutoColumn, Box, Button, Card, FlexGap, Link, Message, Text, useMatchBreakpoints } from '@pancakeswap/uikit'
import dayjs from 'dayjs'
import { useCallback, useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import { useGaugesVotingCount } from 'views/CakeStaking/hooks/useGaugesVotingCount'
import { useCakeLockStatus } from 'views/CakeStaking/hooks/useVeCakeUserInfo'
import { useEpochVotePower } from 'views/GaugesVoting/hooks/useEpochVotePower'
import { GaugeVoting } from 'views/GaugesVoting/hooks/useGaugesVoting'
import { useWriteGaugesVoteCallback } from 'views/GaugesVoting/hooks/useWriteGaugesVoteCallback'
import { RemainVeCakeBalance } from '../../RemainVeCakeBalance'
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
  const { cakeUnlockTime } = useCakeLockStatus()
  const gaugesCount = useGaugesVotingCount()
  const [isOpen, setIsOpen] = useState(false)
  const epochPower = useEpochVotePower()
  const [expanded, setExpanded] = useState(false)
  const [votes, setVotes] = useState<UserVote[]>([])
  const voteSum = useMemo(() => {
    return votes.reduce((acc, cur) => acc + Number(cur?.power), 0)
  }, [votes])
  const lockedPowerPercent = useMemo(() => {
    return votes.reduce((acc, cur) => acc + (cur?.locked ? Number(cur?.power) : 0), 0)
  }, [votes])

  const { rows, onRowAdd, refetch } = useGaugeRows()
  const { isDesktop } = useMatchBreakpoints()
  const rowsWithLock = useMemo(() => {
    return rows?.map((row, index) => {
      return {
        ...row,
        locked: votes[index]?.locked,
      }
    })
  }, [votes, rows])

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

      // @note: if epoch power is 0, the vote action will not works to the final result
      // open it just for better UX understanding vote power is linear changed
      // newVotes[index].power = 100 - sum > 0 && epochPower > 0n ? String(100 - sum) : '0'
      newVotes[index].power = 100 - sum > 0 ? String(100 - sum) : '0'
    } else {
      newVotes[index] = value
    }
    setVotes(newVotes)
  }

  const { writeVote, isPending } = useWriteGaugesVoteCallback()

  const disabled = useMemo(() => {
    const lockedSum = votes.reduce((acc, cur) => acc + (cur?.locked ? Number(cur?.power) : 0), 0)
    const newAddSum = votes.reduce((acc, cur) => acc + (!cur?.locked ? Number(cur?.power) : 0), 0)

    // no epoch power
    if (epochPower === 0n) return true
    // no new votes
    if (newAddSum === 0) return true
    // voted reached 100% or submitting
    if (lockedSum >= 100 || isPending) return true
    // should allow summed votes to be 100%, if new vote added
    if (newAddSum + lockedSum > 100) return true
    return false
  }, [epochPower, isPending, votes])
  const leftGaugesCanAdd = useMemo(() => {
    return Number(gaugesCount) - (rows?.length || 0)
  }, [gaugesCount, rows])

  const submitVote = useCallback(async () => {
    const voteGauges = votes
      .map((vote, i) => {
        if (!vote.locked && Number(vote.power)) {
          return {
            ...rows?.[i],
            weight: Number((Number(vote.power) * 100).toFixed(0)),
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

  // user unselect row
  useEffect(() => {
    if (rows?.length) {
      if (rows.length < votes.length) {
        setVotes(votes.slice(0, rows.length))
      }
    }
  }, [rows, rows?.length, votes, votes.length])

  return (
    <>
      <RemainVeCakeBalance votedPercent={lockedPowerPercent} />
      <AddGaugeModal
        selectRows={rowsWithLock}
        onGaugeAdd={onRowAdd}
        isOpen={isOpen}
        onDismiss={() => setIsOpen(false)}
      />
      <Card innerCardProps={{ padding: isDesktop ? '2em' : '0', paddingTop: isDesktop ? '1em' : '0' }} mt="2em">
        {gauges}

        <Box width={['100%', '100%', '100%', '50%']} px={['16px', 'auto']} mx="auto">
          <Message variant="warning" showIcon>
            <AutoColumn gap="8px">
              <Text>
                {t('Your positions are unlocking on %date%.', {
                  date: dayjs.unix(cakeUnlockTime).format('DD MMM YYYY'),
                })}
                {t(
                  'Therefore, you have no veCAKE balance at the end of the current voting epoch while votes are being tallied.',
                )}
              </Text>
              <FlexGap alignItems="center" gap="0.2em">
                {t('To cast your vote, ')}
                <Link href="/cake-staking">
                  <Text bold>{t('extend your lock >>')}</Text>
                </Link>
              </FlexGap>
            </AutoColumn>
          </Message>
        </Box>
        <FlexGap
          gap="12px"
          padding={isDesktop ? '2em' : '1em'}
          style={{ marginTop: rows && rows?.length > 3 ? 0 : '8px' }}
        >
          <Button width="100%" onClick={() => setIsOpen(true)}>
            + Add Gauges ({leftGaugesCanAdd || 0})
          </Button>
          <Button width="100%" disabled={disabled} onClick={submitVote}>
            Submit vote
          </Button>
        </FlexGap>
      </Card>
    </>
  )
}
